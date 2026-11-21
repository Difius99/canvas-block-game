using System.Data;
using BlockBlast.Application.Contracts.Scores;
using BlockBlast.Domain.Entities;
using BlockBlast.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlockBlast.Application.Scores;

public class ScoreService
{
    private readonly AppDbContext _db;

    public ScoreService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<SubmitScoreResponse?> SubmitScore(int userId, SubmitScoreRequest request)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync();

        // Serialize submissions for this player before reading the previous best.
        var users = await _db.Users
            .FromSql($"""SELECT * FROM "Users" WHERE "Id" = {userId} FOR UPDATE""")
            .AsNoTracking()
            .ToListAsync();
        if (users.Count == 0)
            return null;

        var previousBest = await _db.Scores
            .Where(score => score.UserId == userId)
            .MaxAsync(score => (int?)score.Value) ?? 0;

        _db.Scores.Add(new Score { UserId = userId, Value = request.Score });
        await _db.SaveChangesAsync();
        await transaction.CommitAsync();

        return new SubmitScoreResponse(Math.Max(previousBest, request.Score), request.Score > previousBest);
    }

    public async Task<LeaderboardResponse> GetLeaderboard(int limit, int? userId)
    {
        limit = Math.Clamp(limit, 1, 100);

        var bestScores = _db.Scores
            .Where(score => score.Value > 0)
            .GroupBy(score => score.UserId)
            .Select(scores => new { UserId = scores.Key, Value = scores.Max(score => score.Value) });

        var standings =
            from best in bestScores
            join score in _db.Scores
                on new { best.UserId, best.Value } equals new { score.UserId, score.Value }
            group score by new { best.UserId, best.Value } into results
            select new
            {
                results.Key.UserId,
                results.Key.Value,
                BestScoreAt = results.Min(score => score.CreatedAt)
            };

        // Keep the top and the current player's rank on the same snapshot.
        await using var transaction = await _db.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead);
        var top = await (
            from result in standings
            join user in _db.Users on result.UserId equals user.Id
            orderby result.Value descending, result.BestScoreAt, result.UserId
            select new { result.UserId, user.UserName, result.Value })
            .Take(limit)
            .ToListAsync();

        var entries = top.Select((result, index) =>
            new LeaderboardEntry(index + 1, result.UserName, result.Value)).ToList();

        LeaderboardEntry? me = null;
        if (userId is int currentUserId)
        {
            var topIndex = top.FindIndex(result => result.UserId == currentUserId);
            if (topIndex >= 0)
            {
                me = entries[topIndex];
            }
            else
            {
                var current = await (
                    from result in standings
                    join user in _db.Users on result.UserId equals user.Id
                    where user.Id == currentUserId
                    select new { user.UserName, result.Value, result.BestScoreAt })
                    .SingleOrDefaultAsync();
                if (current is not null)
                {
                    var ahead = await standings.CountAsync(result =>
                        result.Value > current.Value ||
                        (result.Value == current.Value &&
                            (result.BestScoreAt < current.BestScoreAt ||
                             (result.BestScoreAt == current.BestScoreAt && result.UserId < currentUserId))));
                    me = new LeaderboardEntry(ahead + 1, current.UserName, current.Value);
                }
            }
        }

        await transaction.CommitAsync();
        return new LeaderboardResponse(entries, me);
    }
}

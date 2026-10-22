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

    public async Task SubmitScore(int userId, SubmitScoreRequest request)
    {
        if (request.Value < 0)
            throw new ArgumentException("Score must be non-negative");

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            throw new InvalidOperationException("User not found");

        var score = new Score
        {
            UserId = userId,
            Value = request.Value
        };

        _db.Scores.Add(score);
        await _db.SaveChangesAsync();
    }

    public async Task<List<LeaderboardEntry>> GetLeaderboard(int limit)
    {
        limit = Math.Clamp(limit, 1, 100);

        var data = await _db.Scores
            .AsNoTracking()
            .GroupBy(s => s.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                BestScore = g.Max(x => x.Value)
            })
            .Join(
                _db.Users.AsNoTracking(),
                x => x.UserId,
                u => u.Id,
                (x, u) => new
                {
                    u.UserName,
                    x.BestScore
                }
            )
            .OrderByDescending(x => x.BestScore)
            .ThenBy(x => x.UserName)
            .Take(limit)
            .ToListAsync();

        return data
            .Select(x => new LeaderboardEntry(x.UserName, x.BestScore))
            .ToList();
    }
}
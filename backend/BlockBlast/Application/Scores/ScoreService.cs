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
            throw new InvalidOperationException("Score must be non-negative");

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

        return await _db.Scores
            .GroupBy(s => new { s.UserId, s.User.UserName })
            .Select(g => new LeaderboardEntry(g.Key.UserName, g.Max(x => x.Value)))
            .OrderByDescending(x => x.BestScore)
            .ThenBy(x => x.UserName)
            .Take(limit)
            .ToListAsync();
    }
}
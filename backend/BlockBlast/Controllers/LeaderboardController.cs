using BlockBlast.Contracts;
using BlockBlast.Data;
using BlockBlast.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlockBlast.Controllers
{
    [ApiController]
    [Route("api/leaderboard")]
    public class LeaderboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LeaderboardController(AppDbContext db)
        {
            _db = db;
        }

        // при равном счёте выше тот, кто набрал его раньше
        [HttpGet]
        public async Task<ActionResult<LeaderboardResponse>> Get(int limit = 10)
        {
            limit = Math.Clamp(limit, 1, 100);

            var top = await _db.Users
                .Where(u => u.BestScore > 0)
                .OrderByDescending(u => u.BestScore)
                .ThenBy(u => u.BestScoreAt)
                .Take(limit)
                .Select(u => new { u.Username, u.BestScore })
                .ToListAsync();

            var entries = top
                .Select((u, index) => new LeaderboardEntry(index + 1, u.Username, u.BestScore))
                .ToList();

            return Ok(new LeaderboardResponse(entries, await GetCurrentUserEntry()));
        }

        private async Task<LeaderboardEntry?> GetCurrentUserEntry()
        {
            var userId = User.GetUserId();
            if (userId is null)
            {
                return null;
            }

            var user = await _db.Users.FindAsync(userId);
            if (user is null || user.BestScore == 0)
            {
                return null;
            }

            var ahead = await _db.Users.CountAsync(u =>
                u.BestScore > user.BestScore ||
                (u.BestScore == user.BestScore && u.BestScoreAt < user.BestScoreAt));

            return new LeaderboardEntry(ahead + 1, user.Username, user.BestScore);
        }
    }
}

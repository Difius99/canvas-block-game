using BlockBlast.Contracts;
using BlockBlast.Data;
using BlockBlast.Extensions;
using BlockBlast.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlockBlast.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/scores")]
    public class ScoresController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ScoresController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult<SubmitScoreResponse>> Submit(SubmitScoreRequest request)
        {
            var user = await _db.Users.FindAsync(User.GetUserId());
            if (user is null)
            {
                return Unauthorized(new ErrorResponse("Пользователь не найден"));
            }

            var now = DateTime.UtcNow;
            _db.GameResults.Add(new GameResult { UserId = user.Id, Score = request.Score, CreatedAt = now });

            var isNewBest = request.Score > user.BestScore;
            if (isNewBest)
            {
                user.BestScore = request.Score;
                user.BestScoreAt = now;
            }

            await _db.SaveChangesAsync();
            return Ok(new SubmitScoreResponse(user.BestScore, isNewBest));
        }
    }
}

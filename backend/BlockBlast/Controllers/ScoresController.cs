using System.Security.Claims;
using BlockBlast.Application.Contracts.Scores;
using BlockBlast.Application.Scores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlockBlast.Controllers;

[ApiController]
[Route("api")]
public class ScoresController : ControllerBase
{
    private readonly ScoreService _scores;

    public ScoresController(ScoreService scores)
    {
        _scores = scores;
    }

    [Authorize]
    [HttpPost("scores")]
    public async Task<ActionResult<SubmitScoreResponse>> Submit(SubmitScoreRequest request)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return Unauthorized();

        var result = await _scores.SubmitScore(userId, request);
        return result is null ? Unauthorized() : Ok(result);
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<LeaderboardResponse>> Leaderboard([FromQuery] int limit = 10)
    {
        int? userId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        return Ok(await _scores.GetLeaderboard(limit, userId));
    }
}

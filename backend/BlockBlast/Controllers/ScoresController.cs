using System.Security.Claims;
using BlockBlast.Application.Contracts.Scores;
using BlockBlast.Application.Scores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlockBlast.Controllers;

[ApiController]
public class ScoresController : ControllerBase
{
    private readonly ScoreService _scores;

    public ScoresController(ScoreService scores)
    {
        _scores = scores;
    }

    [Authorize]
    [HttpPost("scores")]
    public async Task<IActionResult> Submit(SubmitScoreRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        try
        {
            await _scores.SubmitScore(userId, request);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<LeaderboardEntry>>> Leaderboard([FromQuery] int limit = 50)
    {
        var list = await _scores.GetLeaderboard(limit);
        return Ok(list);
    }
}
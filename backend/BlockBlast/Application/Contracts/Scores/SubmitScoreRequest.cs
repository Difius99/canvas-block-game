using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ScoreEntity = BlockBlast.Domain.Entities.Score;

namespace BlockBlast.Application.Contracts.Scores;

public record SubmitScoreRequest(
    [property: JsonRequired]
    [Range(ScoreEntity.MinValue, ScoreEntity.MaxValue)]
    int Score);

public record SubmitScoreResponse(int BestScore, bool IsNewBest);

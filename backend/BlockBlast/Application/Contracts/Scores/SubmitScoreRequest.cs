using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlockBlast.Application.Contracts.Scores;

public record SubmitScoreRequest(
    [property: JsonRequired]
    [Range(0, 10_000_000)]
    int Score);

public record SubmitScoreResponse(int BestScore, bool IsNewBest);

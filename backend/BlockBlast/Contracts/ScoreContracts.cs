using System.ComponentModel.DataAnnotations;

namespace BlockBlast.Contracts
{
    public record SubmitScoreRequest(
        [Range(0, 10_000_000, ErrorMessage = "Некорректный счёт")] int Score);

    public record SubmitScoreResponse(int BestScore, bool IsNewBest);

    public record LeaderboardEntry(int Rank, string Username, int Score);

    // Me — место текущего игрока, если он авторизован и у него есть результат
    public record LeaderboardResponse(List<LeaderboardEntry> Entries, LeaderboardEntry? Me);
}

namespace BlockBlast.Application.Contracts.Scores;

public record LeaderboardEntry(int Rank, string Username, int Score);

public record LeaderboardResponse(List<LeaderboardEntry> Entries, LeaderboardEntry? Me);

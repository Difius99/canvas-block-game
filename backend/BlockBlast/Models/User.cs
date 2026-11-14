namespace BlockBlast.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        // имя в верхнем регистре — для проверки уникальности без учёта регистра
        public string NormalizedUsername { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public int BestScore { get; set; }

        public DateTime? BestScoreAt { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<GameResult> GameResults { get; set; } = new();
    }
}

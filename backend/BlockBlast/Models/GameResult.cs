namespace BlockBlast.Models
{
    public class GameResult
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public int Score { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

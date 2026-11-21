namespace BlockBlast.Domain.Entities;

public class Score
{
    public const int MinValue = 0;
    public const int MaxValue = 10_000_000;

    public int Id { get; set; }

    public int Value { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

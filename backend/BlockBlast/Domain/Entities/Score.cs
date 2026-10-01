namespace BlockBlast.Domain.Entities;

public class Score
{
    public int Id { get; set; }

    public int Value { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public int UserId { get; set; }
    public User User { get; set; } = null!;
}

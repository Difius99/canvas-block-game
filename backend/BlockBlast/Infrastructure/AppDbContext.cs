using BlockBlast.Domain.Entities;

using Microsoft.EntityFrameworkCore;


namespace BlockBlast.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Score> Scores => Set<Score>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(x => x.UserName).IsUnique();     
            e.Property(x => x.UserName).HasMaxLength(50).IsRequired();
            e.Property(x => x.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Score>(e =>
        {
            e.Property(x => x.Value).IsRequired();
            e.HasOne(x => x.User)
             .WithMany(u => u.Scores)
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

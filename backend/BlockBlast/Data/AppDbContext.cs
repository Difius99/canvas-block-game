using BlockBlast.Models;
using Microsoft.EntityFrameworkCore;

namespace BlockBlast.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        public DbSet<GameResult> GameResults => Set<GameResult>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(user =>
            {
                user.Property(u => u.Username).HasMaxLength(20);
                user.Property(u => u.NormalizedUsername).HasMaxLength(20);
                user.HasIndex(u => u.NormalizedUsername).IsUnique();
                user.HasIndex(u => u.BestScore);
            });

            modelBuilder.Entity<GameResult>(result =>
            {
                result.HasOne(r => r.User)
                    .WithMany(u => u.GameResults)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

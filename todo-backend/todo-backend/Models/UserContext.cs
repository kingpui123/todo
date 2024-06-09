using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.Entity<User>(entity =>
      {
        entity.Property(p => p.FamilyName).HasColumnName("family_name");
        entity.Property(p => p.GivenName).HasColumnName("given_name");
        entity.Property(p => p.RefreshToken).HasColumnName("refresh_token");
        entity.Property(p => p.UserName).HasColumnName("user_name");
      });
   }

    public DbSet<User> Users { get; set; } = null!;
}
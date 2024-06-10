using Microsoft.EntityFrameworkCore;
using Marques.EFCore.SnakeCase;

namespace TodoApi.Models;

public class UserContext : DbContext
{
    public UserContext(DbContextOptions<UserContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ToSnakeCase();

   }

    public DbSet<User> Users { get; set; } = null!;
}
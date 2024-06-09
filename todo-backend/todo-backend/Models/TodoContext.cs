using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.Entity<Todo>(entity =>
      {
        entity.Property(p => p.DueTime).HasColumnName("due_time");
        entity.Property(p => p.UserId).HasColumnName("user_id");
        entity.Property(p => p.CreatedAt).HasColumnName("created_at");
        entity.Property(p => p.UpdatedAt).HasColumnName("updated_at");
      });
   }

    public DbSet<Todo> Todos { get; set; } = null!;
}
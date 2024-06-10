using Microsoft.EntityFrameworkCore;
using Marques.EFCore.SnakeCase;

namespace TodoApi.Models;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ToSnakeCase();
   }

    public DbSet<Todo> Todos { get; set; } = null!;
}
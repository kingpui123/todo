using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TodoApi.Models;

public class TodoService : ITodoService
{
    private readonly TodoContext _context;

    public TodoService(TodoContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TodoDto>> SearchAsync(SearchTodoDto? search, SortTodoDto? sort, string userId) {
        string sortOrderString = sort?.SortOrder == 1 ? " asc": " desc"; 
        string sortBy = sort?.SortBy != null ? sort.SortBy : "created_at";

        var query = applyQueryCond(_context.Todos.AsQueryable(), search, userId);
        
        if (sort?.SortBy != null) {
            query = query.OrderBy(sort.SortBy + sortOrderString);
        }

        var result = await query.ToListAsync();

        return result.Select(t => new TodoDto
        {
            Id = t.Id,
            Name = t.Name,
            Description = t.Description,
            DueTime = t.DueTime,
            Status = t.Status,
            Priority = t.Priority,
            Importance = t.Importance,
            Tags = t.Tags,
        });
        
    }

    public async Task<TodoDto?> GetByIdAsync(int id, string userId) {
        var todo = await _context.Todos.FirstAsync(t => t.Id == id && t.UserId == userId);
        if (todo == null)
        {
            return null;
        }

        return new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            DueTime = todo.DueTime,
            Status = todo.Status,
            Priority = todo.Priority,
            Importance = todo.Importance,
            Tags = todo.Tags,
        };
    }

    public async Task<TodoDto> CreateAsync(CreateTodoDto createDto, string userId)
    {
        var todo = new Todo
        {
            Name = createDto.Name ?? "",
            Description = createDto.Description ?? "",
            Status = createDto.Status ?? "",
            Priority = createDto.Priority ?? 0,
            Importance = createDto.Importance ?? 0,
            Tags = createDto.Tags ?? [],
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        if (createDto.DueTime != null)
        {
            todo.DueTime = (DateTime)createDto.DueTime;
        }
    
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        return new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            DueTime = todo.DueTime,
            Status = todo.Status,
            Priority = todo.Priority,
            Importance = todo.Importance,
            Tags = todo.Tags,
        };
    }

    public async Task<TodoDto?> UpdateAsync(int id, UpdateTodoDto updateDto, string userId)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null || todo.UserId != userId)
        {
            return null;
        }

        if (updateDto.Name != null) {
            todo.Name = updateDto.Name;
        }
        
        if (updateDto.Description != null) {
            todo.Description = updateDto.Description;
        }

        if (updateDto.DueTime != null) {
            todo.DueTime = (DateTime)updateDto.DueTime;
        }

        if (updateDto.Status != null) {
            todo.Status = updateDto.Status;
        }

        if (updateDto.Priority != null) {
            todo.Priority = (int)updateDto.Priority;
        }

        if (updateDto.Importance != null) {
            todo.Importance = (int)updateDto.Importance;
        }

        if (updateDto.Status != null) {
            todo.Status = updateDto.Status;
        }

        if (updateDto.Tags != null) {
            todo.Tags = updateDto.Tags;
        }

        await _context.SaveChangesAsync();
        return new TodoDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            DueTime = todo.DueTime,
            Status = todo.Status,
            Priority = todo.Priority,
            Importance = todo.Importance,
            Tags = todo.Tags,
        };
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var todo = await _context.Todos.FirstAsync(t => t.Id == id && t.UserId == userId);
        if (todo == null)
        {
            return false;
        }

        
        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
        return true;
    }


    private static IQueryable<Todo> applyQueryCond(IQueryable<Todo> query, SearchTodoDto? search, string userId) {
        if (search == null) {
            return query;
        }

        if (search.Name != null) {
            query = query.Where(t => t.Name.Contains(search.Name));
        }

        if (search.Status != null && search.Status.Length > 0) {
            query = query.Where(t => search.Status.Any(status => t.Status == status));
        }

        if (search.Priority != null && search.Priority.Length > 0) {
            query = query.Where(t => search.Priority.Any(priority => t.Priority == priority));
        }

        if (search.Importance != null && search.Importance.Length > 0) {
            query = query.Where(t => search.Importance.Any(importance => t.Importance == importance));
        }

        if (search.Tags != null && search.Tags.Length > 0) {
            query = query.Where(t => search.Tags.Any(tag => t.Tags.Contains(tag)));
        }

        if (search.StartTime != null && search.EndTime != null) {
            query = query.Where(t => t.DueTime >= search.StartTime && t.DueTime <= search.EndTime);
        }

        return query;
    }

}
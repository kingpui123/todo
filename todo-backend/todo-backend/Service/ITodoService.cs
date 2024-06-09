using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApi.Models;

public interface ITodoService
{
    Task<IEnumerable<TodoDto>> SearchAsync(SearchTodoDto? search, SortTodoDto? sort, string userId);
    Task<TodoDto?> GetByIdAsync(int id, string userId);
    Task<TodoDto> CreateAsync(CreateTodoDto createDto, string userId);
    Task<TodoDto?> UpdateAsync(int id, UpdateTodoDto updateDto, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}
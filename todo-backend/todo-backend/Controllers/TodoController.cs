using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Microsoft.Extensions.Logging;
using NuGet.Protocol;
using Newtonsoft.Json;

namespace todo_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class TodoController : ControllerBase
    {
        private readonly TodoContext _context;
        private readonly ITodoService _todoService;
        private readonly AIService _aiService;
         private readonly ILogger<TodoController> _logger;

        public TodoController(TodoContext context, ILogger<TodoController> logger, ITodoService todoService, AIService aiService)
        {
            _context = context;
            _logger = logger;
            _todoService = todoService;
            _aiService = aiService;
        }

        // GET: api/Todo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoDto>> GetTodo(int id)
        {
            string userId = getUserId();
            var todo = await _todoService.GetByIdAsync(id, userId);

            if (todo == null)
            {
                return NotFound();
            }

            return todo;
        }

        [HttpPost("generate/ai")]
        public async Task<ActionResult<AITodoDto>> GenerateByAI([FromBody] AIRequest req)
        {
            var suggestedJson = await _aiService.GenerateTodo(req.Description);
            AITodoDto? newTodo = JsonConvert.DeserializeObject<AITodoDto>(suggestedJson ?? "");

            return Ok(newTodo);
        }

        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<TodoDto>>> SearchTodos([FromBody]SearchBody body)
        {
            var todos = await _todoService.SearchAsync(body.Search, body.Sort, getUserId());

            return Ok(todos);   
        }


        // POST: api/Todo
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TodoDto>> PostTodo(CreateTodoDto createTodo)
        {
            var newTodo = await _todoService.CreateAsync(createTodo, getUserId());
           

            return newTodo;
        }

          // POST: api/Todo/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        public async Task<ActionResult<TodoDto>> UpdateTodo(int id, [FromBody]UpdateTodoDto updateTodo)
        {
            var newTodo = await _todoService.UpdateAsync(id, updateTodo, getUserId());
        
            return newTodo;
        }

        // DELETE: api/Todo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var result = await _todoService.DeleteAsync(id, getUserId());
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        private string getUserId()
        {
            return HttpContext.Items["UserId"].ToString();
        }
    }
}

public class SearchBody {
    public SearchTodoDto? Search { get; set; }
    public SortTodoDto? Sort  {get; set;}
}

public class AIRequest {
    public string Description {get; set;}
}

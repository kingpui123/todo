namespace TodoApi.Models;
public class TodoDto
{
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueTime { get; set; }
        public string? Status { get; set; }
        public int? Priority { get; set; }
        public int? Importance { get; set; }
        public string[]? Tags { get; set;}
}

public class CreateTodoDto : TodoDto
{
}


public class UpdateTodoDto : TodoDto 
{       
}

public class SearchTodoDto
{
    public string? Name { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string[]? Status { get; set; }
    public int[]? Priority { get; set; }

    public int[]? Importance { get; set; }
    public string[]? Tags { get; set; }
       
}

public class SearchPage {
        public int Page { get; set; }
        public int PageSize { get; set; }
}

public class SortTodoDto
{
    public string? SortBy { get; set; }
    public int? SortOrder { get; set; }
}

public class AITodoDto {
      public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Priority { get; set; }
        public int? Importance { get; set; }
        public string[]? Tags { get; set;}
}
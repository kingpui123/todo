namespace TodoApi.Models;

public class Todo
{
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueTime { get; set; }
        public string Status { get; set; }
        public int Priority { get; set; }
        public int Importance { get; set; }
        public string UserId { get; set; }
        public string[] Tags {get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
}

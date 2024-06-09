namespace TodoApi.Models
{
    public class User
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public string FamilyName { get; set; }

        public string GivenName { get; set; }
        public string RefreshToken { get; set; }
        public string Picture { get; set; }
        public ICollection<Todo> Todos { get; set; }
    }
}
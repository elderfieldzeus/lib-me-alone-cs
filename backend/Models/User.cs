namespace backend.Models
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public DateTime created_at { get; set; } = DateTime.MinValue;
        public string role {  get; set; } = "user";

    }
}

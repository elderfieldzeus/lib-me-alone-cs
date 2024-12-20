namespace backend.Models
{
    public class Book
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string author { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public bool is_borrowed { get; set; }
    }
}

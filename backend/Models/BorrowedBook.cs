namespace backend.Models
{
    public class BorrowedBook
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public int book_id { get; set; }
        public bool is_returned { get; set; }
        public bool is_approved { get; set; }
        public DateTime date_borrowed { get; set; }
    }
}

namespace backend.Dtos.BorrowedBook
{
    public class YourBookDto
    {
        public int id { get; set; }
        public string borrower_name { get; set; } = string.Empty;
        public string book_name { get; set; } = string.Empty;
        public DateTime date_borrowed { get; set; } = DateTime.MinValue ;
    }
}

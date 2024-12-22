using backend.Database;
using backend.Dtos.BorrowedBook;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Xml.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/borrowedbook")]
    public class BorrowedBookController : Controller
    {
        [HttpPost]
        public ActionResult BorrowBook([FromBody] BorrowedBookDto bbDto)
        {
            MySqlConnection? conn = Connection.getConnection();
            

            if (conn == null)
            {
                return StatusCode(500, new { success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "SELECT * FROM borrowed_books WHERE book_id = @book_id AND user_id = @user_id AND is_returned = false";
                cmd.Parameters.AddWithValue("@book_id", bbDto.book_id);
                cmd.Parameters.AddWithValue("@user_id", bbDto.user_id);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return BadRequest(new { message = "Request for borrow has already been sent.", success = false });
                    }
                }

                cmd.Parameters.Clear();
                cmd.CommandText = "SELECT * FROM books WHERE id = @book_id";
                cmd.Parameters.AddWithValue("@book_id", bbDto.book_id);

                using (var reader = cmd.ExecuteReader()) { 
                    if (!reader.Read())
                    {
                        return BadRequest(new { message = "Invalid borrow request", success = false});
                    }

                    if (reader.GetBoolean("is_borrowed") == true)
                    {
                        return BadRequest(new { message = "Book is already borrowed", success = false });
                    }
                }

                cmd.Parameters.Clear();
                cmd.CommandText = "INSERT INTO borrowed_books(user_id, book_id) VALUES (@user_id, @book_id)";
                cmd.Parameters.AddWithValue("@user_id", bbDto.user_id);
                cmd.Parameters.AddWithValue("@book_id", bbDto.book_id);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok(new { message = "Successfully borrowed book", success = true });
        }

        [HttpPost("approve")]
        public ActionResult ApproveBook(int id)
        {
            MySqlConnection? conn = Connection.getConnection();
            int book_id;

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "UPDATE borrowed_books SET is_approved = true WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);

                book_id = Convert.ToInt32(cmd.ExecuteScalar());

                cmd.Parameters.Clear();
                cmd.CommandText = "UPDATE books SET is_borrowed = true WHERE id = @book_id";
                cmd.Parameters.AddWithValue("@book_id", book_id);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok();
        }

        [HttpPost("return")]
        public ActionResult ReturnBook(int id)
        {
            MySqlConnection? conn = Connection.getConnection();
            int book_id;

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "SELECT book_id FROM borrowed_books WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);

                using(var reader = cmd.ExecuteReader())
                {
                    if(!reader.Read())
                    {
                        return BadRequest();
                        
                    }

                    book_id = reader.GetInt32("book_id");
                }

                cmd.Parameters.Clear();
                cmd.CommandText = "UPDATE books SET is_borrowed = false WHERE id = @book_id";
                cmd.Parameters.AddWithValue("@book_id", book_id);
                cmd.ExecuteNonQuery();

                cmd.Parameters.Clear();
                cmd.CommandText = "UPDATE borrowed_books SET is_returned = true WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok();
        }

        [HttpGet("requested")]
        public ActionResult GetRequestedBooks()
        {
            MySqlConnection? conn = Connection.getConnection();
            MySqlDataReader reader;

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM borrowed_books WHERE is_approved = false AND is_returned = false";

                reader = cmd.ExecuteReader();

                List<BorrowedBook> books = new List<BorrowedBook>();

                while (reader.Read())
                {
                    BorrowedBook book = new BorrowedBook();

                    Console.WriteLine(reader);

                    book.id = (reader.GetInt32("id"));
                    book.user_id = (reader.GetInt32("user_id"));
                    book.book_id = (reader.GetInt32("book_id"));
                    book.is_returned = false;
                    book.is_approved = false;
                    book.date_borrowed = (reader.GetDateTime("date_borrowed"));

                    books.Add(book);
                }

                conn.Close();
                return Ok(books);
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("requested/{id:int}")]
        public ActionResult DeleteBooks([FromRoute]int id)
        {
            MySqlConnection? conn = Connection.getConnection();

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "DELETE FROM borrowed_books WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();

                conn.Close();
                return Ok(new { message = "Successfully cancelled borrow request", success = true });
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, new { message = ex.Message, success = false });
            }
        }

        [HttpGet("requested/{id:int}")]
        public ActionResult GetUserRequestedBooks([FromRoute] int id)
        {
            MySqlConnection? conn = Connection.getConnection();
            MySqlDataReader reader;

            if (conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "" +
                    "SELECT bb.id AS id, username, name, date_borrowed FROM borrowed_books bb " +
                    "JOIN users u ON bb.user_id = u.id " +
                    "JOIN books b ON bb.book_id = b.id " +
                    "WHERE user_id = @id " +
                    "AND is_approved = false " +
                    "AND is_returned = false" +
                    "";
                cmd.Parameters.AddWithValue("@id", id);

                reader = cmd.ExecuteReader();

                List<YourBookDto> books = new List<YourBookDto>();

                while (reader.Read())
                {
                    YourBookDto book = new YourBookDto();

                    Console.WriteLine(reader);

                    book.id = (reader.GetInt32("id"));
                    book.borrower_name = (reader.GetString("username"));
                    book.book_name = (reader.GetString("name"));
                    book.date_borrowed = (reader.GetDateTime("date_borrowed"));

                    books.Add(book);
                }

                conn.Close();
                return Ok(new {books = books, success = true});
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, new {message = ex.Message, success = false});
            }
        }

        [HttpGet("unreturned")]
        public ActionResult GetUnreturnedBooks()
        {
            MySqlConnection? conn = Connection.getConnection();
            MySqlDataReader reader;

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM borrowed_books WHERE is_approved = true AND is_returned = false";

                reader = cmd.ExecuteReader();

                List<BorrowedBook> books = new List<BorrowedBook>();

                while (reader.Read())
                {
                    BorrowedBook book = new BorrowedBook();

                    Console.WriteLine(reader);

                    book.id = (reader.GetInt32("id"));
                    book.user_id = (reader.GetInt32("user_id"));
                    book.book_id = (reader.GetInt32("book_id"));
                    book.is_returned = false;
                    book.is_approved = true;
                    book.date_borrowed = (reader.GetDateTime("date_borrowed"));

                    books.Add(book);
                }

                conn.Close();
                return Ok(books);
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("unreturned/{id:int}")]
        public ActionResult GetUserUnreturnedBooks([FromRoute] int id)
        {
            MySqlConnection? conn = Connection.getConnection();
            MySqlDataReader reader;

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "" +
                    "SELECT bb.id AS id, username, name, date_borrowed FROM borrowed_books bb " +
                    "JOIN users u ON bb.user_id = u.id " +
                    "JOIN books b ON bb.book_id = b.id " +
                    "WHERE user_id = @id " +
                    "AND is_approved = true " +
                    "AND is_returned = false" +
                    "";
                cmd.Parameters.AddWithValue("@id", id);

                reader = cmd.ExecuteReader();

                List<YourBookDto> books = new List<YourBookDto>();

                while (reader.Read())
                {
                    YourBookDto book = new YourBookDto();

                    Console.WriteLine(reader);

                    book.id = (reader.GetInt32("id"));
                    book.borrower_name = (reader.GetString("username"));
                    book.book_name = (reader.GetString("name"));
                    book.date_borrowed = (reader.GetDateTime("date_borrowed"));

                    books.Add(book);
                }

                conn.Close();
                return Ok(new { books = books, success = true });
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, new { message = ex.Message, success = false });
            }
        }
    }
}

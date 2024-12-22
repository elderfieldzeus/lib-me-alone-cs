using backend.Database;
using backend.Dtos.Book;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/book")]
    public class BookController : Controller
    {
        [HttpGet("{page:int}")]
        public ActionResult GetBooks([FromRoute] int page)
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
                cmd.CommandText = "SELECT * FROM books WHERE is_borrowed = false LIMIT 8 OFFSET @page";
                cmd.Parameters.AddWithValue("@page", page * 8);

                reader = cmd.ExecuteReader();

                List<Book> books = new List<Book>();

                while (reader.Read())
                {
                    Book book = new Book();

                    Console.WriteLine(reader);

                    book.id = (reader.GetInt32("id"));
                    book.name = (reader.GetString("name"));
                    book.author = (reader.GetString("author"));
                    book.description = (reader.GetString("description"));
                    book.is_borrowed = (reader.GetBoolean("is_borrowed"));

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

        [HttpPost]
        public ActionResult CreateBook([FromBody] BookDto book)
        {
            MySqlConnection? conn = Connection.getConnection();

            if (conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "INSERT INTO books(name, author, description) VALUES (@name, @author, @desc)";

                cmd.Parameters.AddWithValue("@name", book.name);
                cmd.Parameters.AddWithValue("@author", book.author);
                cmd.Parameters.AddWithValue("@desc", book.description);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, new { message = ex.Message, success = false }); ;
            }

            conn.Close();
            return Ok(new { message = "Successfully added book", success = true });
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteBook([FromRoute] int id)
        {
            MySqlConnection? conn = Connection.getConnection();

            if (conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "DELETE FROM borrowed_books WHERE book_id = @id";
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();

                cmd.Parameters.Clear();
                cmd.CommandText = "DELETE FROM books WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, new {message = ex.Message, success = false});
            }

            conn.Close();
            return Ok(new { message = "Successfully deleted book.", success = true});
        }


    }
}

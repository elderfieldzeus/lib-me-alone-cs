using backend.Database;
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
        [HttpGet]
        public ActionResult Index()
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
                cmd.CommandText = "SELECT * FROM books";

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

       
    }
}

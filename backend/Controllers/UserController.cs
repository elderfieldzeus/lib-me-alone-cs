using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;

namespace backend.Controllers
{


    [ApiController]
    [Route("api/user")]
    public class UserController : Controller
    {
        [HttpGet]
        public ActionResult GetUser()
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
                cmd.CommandText = "SELECT * FROM users WHERE role = 'user'";

                reader = cmd.ExecuteReader();

                List<User> users = new List<User>();

                while (reader.Read())
                {
                    User user = new User();

                    user.id = reader.GetInt32("id");
                    user.username = reader.GetString("username");
                    user.password = reader.GetString("password");
                    user.created_at = reader.GetDateTime("created_at");
                    user.role = reader.GetString("role");

                    users.Add(user);
                }

                conn.Close();
                return Ok(users);
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("librarian")]
        public ActionResult GetLibrarians()
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
                cmd.CommandText = "SELECT * FROM users WHERE role = 'librarian'";

                reader = cmd.ExecuteReader();

                List<User> librarians = new List<User>();

                while (reader.Read())
                {
                    User librarian = new User();

                    librarian.id = reader.GetInt32("id");
                    librarian.username = reader.GetString("username");
                    librarian.password = reader.GetString("password");
                    librarian.created_at = reader.GetDateTime("created_at");
                    librarian.role = reader.GetString("role");

                    librarians.Add(librarian);
                }

                conn.Close();
                return Ok(librarians);
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("admin")]
        public ActionResult GetAdmins()
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
                cmd.CommandText = "SELECT * FROM users WHERE role = 'admin'";

                reader = cmd.ExecuteReader();

                List<User> admins = new List<User>();

                while (reader.Read())
                {
                    User admin = new User();

                    admin.id = reader.GetInt32("id");
                    admin.username = reader.GetString("username");
                    admin.password = reader.GetString("password");
                    admin.created_at = reader.GetDateTime("created_at");
                    admin.role = reader.GetString("role");

                    admins.Add(admin);
                }

                conn.Close();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("auth")]
        public ActionResult SignUp(string username, string password, string cpassword)
        {
            if (!password.Equals(cpassword))
            {
                return BadRequest("Passwords must match.");
            }

            MySqlConnection? conn = Connection.getConnection();

            if(conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM users WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", username);

                int id = Convert.ToInt32(cmd.ExecuteScalar());

                if (id != 0)
                {
                    return BadRequest("Username already taken");
                }

                cmd.CommandText = "INSERT INTO users(username, password) VALUES (@user, @password)";
                cmd.Parameters.AddWithValue("@user", username);
                cmd.Parameters.AddWithValue("@password", password);

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

        [HttpGet("auth")]
        public ActionResult Login(string username, string password)
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
                cmd.CommandText = "SELECT * FROM users WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", username);

                reader = cmd.ExecuteReader();

                if (!reader.Read() || !reader.GetString("password").Equals(password))
                {
                    return BadRequest("Invalid login attempt");
                }

            }
            catch (Exception ex)
            {
                conn.Close();       
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok();
        }

        [HttpDelete]
        public ActionResult DeleteUser(int id)
        {
            MySqlConnection? conn = Connection.getConnection();

            if (conn == null)
            {
                return StatusCode(500);
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "DELETE FROM users WHERE id = @id";
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
    }
}

using backend.Database;
using backend.Dtos.User;
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

        [HttpPost("signup")]
        public ActionResult SignUp([FromBody] SignupDto signup_data)
        {
            if (!signup_data.password.Equals(signup_data.cpassword))
            {
                return BadRequest(new { message = "Passwords must match.", success = false });
            }

            MySqlConnection? conn = Connection.getConnection();

            if(conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM users WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", signup_data.username);

                int id = Convert.ToInt32(cmd.ExecuteScalar());

                if (id != 0)
                {
                    return BadRequest(new { message = "Username already taken", success = false});
                }

                cmd.CommandText = "INSERT INTO users(username, password) VALUES (@user, @password)";
                cmd.Parameters.AddWithValue("@user", signup_data.username);
                cmd.Parameters.AddWithValue("@password", signup_data.password);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok(new { message = "Successfully created an account.", success = true });
        }

        [HttpPost("signup/lib")]
        public ActionResult SignUpLib([FromBody] SignupDto signup_data)
        {
            if (!signup_data.password.Equals(signup_data.cpassword))
            {
                return BadRequest(new { message = "Passwords must match.", success = false });
            }

            MySqlConnection? conn = Connection.getConnection();

            if (conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM users WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", signup_data.username);

                int id = Convert.ToInt32(cmd.ExecuteScalar());

                if (id != 0)
                {
                    return BadRequest(new { message = "Username already taken", success = false });
                }

                cmd.CommandText = "INSERT INTO users(username, password, role) VALUES (@user, @password, @role)";
                cmd.Parameters.AddWithValue("@user", signup_data.username);
                cmd.Parameters.AddWithValue("@password", signup_data.password);
                cmd.Parameters.AddWithValue("@role", "librarian");

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                conn.Close();
                return StatusCode(500, ex.Message);
            }

            conn.Close();
            return Ok(new { message = "Successfully created an account.", success = true });
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody]LoginDto login_data)
        {
            MySqlConnection? conn = Connection.getConnection();
            MySqlDataReader reader;
            int id;
            string role;
            DateTime created_at;

            if (conn == null)
            {
                return StatusCode(500, new { message = "Internal Server Error", success = false });
            }

            try
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM users WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", login_data.username);

                reader = cmd.ExecuteReader();

                if (!reader.Read() || !reader.GetString("password").Equals(login_data.password))
                {
                    return StatusCode(401, new { message = "Invalid login attempt", success = false});
                }

                id = reader.GetInt32("id");
                role = reader.GetString("role");
                created_at = reader.GetDateTime("created_at");
            }
            catch (Exception ex)
            {
                conn.Close();       
                return StatusCode(500, new { message = ex.Message, success = false });
            }

            conn.Close();
            return Ok(new {id = id, role = role, created_at = created_at, success = true });
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteUser([FromRoute]int id)
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

using MySql.Data.MySqlClient;

namespace backend.Database
{
    public class Connection
    {
        private static string mysqlconn = "server=localhost; user=root; database=library; password=";
        public Connection()
        {

        }

        public static MySqlConnection? getConnection()
        {
            MySqlConnection? mySqlConnection = null;

            try
            {
                mySqlConnection = new MySqlConnection(mysqlconn);
                mySqlConnection.Open();

                MySqlCommand cmd = mySqlConnection.CreateCommand();
                cmd.CommandText = "INSERT INTO `users`(`username`, `password`, `role`) VALUES ('zeus', '123', 'admin')";
                cmd.ExecuteNonQuery();
                Console.Write("Connected successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
            return mySqlConnection;
        }
    }
}

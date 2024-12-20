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

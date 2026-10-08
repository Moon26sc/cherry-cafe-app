<?php
class Database {
    private $host = "localhost"; 
    private $port = "5432";      
    private $db_name = "cherrycoffee";
    private $username = "postgres"; 
    private $password = "admin"; 
    
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $exception) {
            echo "Error de conexión a PostgreSQL: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
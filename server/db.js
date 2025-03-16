
const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_management'
};

let pool;

async function initialize() {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('MySQL database connected');
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birthday VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
      )
    `);
    console.log('Users table initialized');
    
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

function query(sql, params) {
  if (!pool) throw new Error('Database not initialized');
  return pool.execute(sql, params);
}

module.exports = {
  initialize,
  query
};

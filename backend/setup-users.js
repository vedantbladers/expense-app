// Database setup for users - creates the users table
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Setting up users table...');

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('employee', 'manager', 'admin') DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
)`;

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // Create the users table
  db.query(createUsersTableSQL, (err, result) => {
    if (err) {
      console.error('❌ Error creating users table:', err);
      return;
    }
    
    console.log('✅ Users table created successfully!');
    
    // Insert some sample users
    const sampleUsers = [
      {
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123', // In real app, this should be hashed
        full_name: 'System Administrator',
        role: 'admin'
      },
      {
        username: 'manager1',
        email: 'manager@company.com',
        password: 'manager123',
        full_name: 'John Manager',
        role: 'manager'
      },
      {
        username: 'employee1',
        email: 'employee@company.com',
        password: 'emp123',
        full_name: 'Jane Employee',
        role: 'employee'
      }
    ];
    
    // Insert sample users
    const insertSQL = 'INSERT IGNORE INTO users (username, email, password, full_name, role) VALUES ?';
    const values = sampleUsers.map(user => [
      user.username,
      user.email,
      user.password,
      user.full_name,
      user.role
    ]);
    
    db.query(insertSQL, [values], (err, result) => {
      if (err) {
        console.error('❌ Error inserting sample users:', err);
      } else {
        console.log(`✅ Inserted ${result.affectedRows} sample users`);
      }
      
      // Display the users
      db.query('SELECT id, username, email, full_name, role, created_at FROM users', (err, results) => {
        if (err) {
          console.error('❌ Error fetching users:', err);
        } else {
          console.log('📋 Current users in database:');
          console.table(results);
        }
        
        db.end();
        console.log('🔐 Users table setup complete!');
      });
    });
  });
});
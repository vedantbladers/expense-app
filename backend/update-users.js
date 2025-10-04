// Update existing users table to add missing columns
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Updating users table...');

const alterTableQueries = [
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE AFTER id",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) AFTER password", 
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('employee', 'manager', 'admin') DEFAULT 'employee' AFTER full_name",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER role",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER updated_at"
];

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // Execute each ALTER query
  let completed = 0;
  
  alterTableQueries.forEach((query, index) => {
    db.query(query, (err, result) => {
      if (err && !err.message.includes('Duplicate column')) {
        console.error(`❌ Error with query ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Query ${index + 1} completed`);
      }
      
      completed++;
      
      if (completed === alterTableQueries.length) {
        // Now check the updated structure
        db.query('DESCRIBE users', (err, results) => {
          if (err) {
            console.error('❌ Error describing table:', err);
          } else {
            console.log('📋 Updated users table structure:');
            console.table(results);
          }
          
          // Insert sample users if none exist
          db.query('SELECT COUNT(*) as count FROM users', (err, results) => {
            if (err) {
              console.error('❌ Error counting users:', err);
              db.end();
              return;
            }
            
            if (results[0].count === 0) {
              console.log('📝 Adding sample users...');
              const insertSQL = `INSERT INTO users (username, name, email, password, full_name, role) VALUES 
                ('admin', 'Administrator', 'admin@company.com', 'admin123', 'System Administrator', 'admin'),
                ('manager1', 'John Manager', 'manager@company.com', 'manager123', 'John Manager', 'manager'), 
                ('employee1', 'Jane Employee', 'employee@company.com', 'emp123', 'Jane Employee', 'employee')`;
              
              db.query(insertSQL, (err, result) => {
                if (err) {
                  console.error('❌ Error inserting sample users:', err);
                } else {
                  console.log(`✅ Inserted ${result.affectedRows} sample users`);
                }
                
                db.end();
                console.log('🔐 Users table update complete!');
              });
            } else {
              console.log(`ℹ️  Users table already has ${results[0].count} users`);
              db.end();
              console.log('🔐 Users table update complete!');
            }
          });
        });
      }
    });
  });
});
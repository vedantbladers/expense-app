// Database test script
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Testing database connection...');

// Test connection
db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL successfully!');
  
  // Test if expenses table exists
  db.query('SHOW TABLES LIKE "expenses"', (err, results) => {
    if (err) {
      console.error('❌ Error checking tables:', err);
      return;
    }
    
    if (results.length > 0) {
      console.log('✅ Expenses table exists');
      
      // Get table structure
      db.query('DESCRIBE expenses', (err, results) => {
        if (err) {
          console.error('❌ Error describing table:', err);
          return;
        }
        
        console.log('📋 Expenses table structure:');
        console.table(results);
        
        // Count existing records
        db.query('SELECT COUNT(*) as count FROM expenses', (err, results) => {
          if (err) {
            console.error('❌ Error counting records:', err);
          } else {
            console.log(`📊 Total expenses in database: ${results[0].count}`);
          }
          
          // Close connection
          db.end();
          console.log('🔐 Database connection closed');
        });
      });
    } else {
      console.log('⚠️  Expenses table does not exist');
      console.log('💡 You may need to create the table. Here\'s the SQL:');
      console.log(`
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  paidBy VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  remarks TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  receipt VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
);`);
      db.end();
    }
  });
});
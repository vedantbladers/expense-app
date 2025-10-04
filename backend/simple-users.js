// Simple approach - work with existing table structure
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Setting up users with existing table structure...');

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // First, check current users
  db.query('SELECT COUNT(*) as count FROM users', (err, results) => {
    if (err) {
      console.error('❌ Error counting users:', err);
      db.end();
      return;
    }
    
    if (results[0].count === 0) {
      console.log('📝 Adding sample users...');
      // Use only existing columns: id, name, email, password, country
      const insertSQL = `INSERT INTO users (name, email, password, country) VALUES 
        ('System Administrator', 'admin@company.com', 'admin123', 'USA'),
        ('John Manager', 'manager@company.com', 'manager123', 'USA'), 
        ('Jane Employee', 'employee@company.com', 'emp123', 'USA')`;
      
      db.query(insertSQL, (err, result) => {
        if (err) {
          console.error('❌ Error inserting sample users:', err);
        } else {
          console.log(`✅ Inserted ${result.affectedRows} sample users`);
        }
        
        // Show all users
        db.query('SELECT * FROM users', (err, results) => {
          if (err) {
            console.error('❌ Error fetching users:', err);
          } else {
            console.log('📋 Current users in database:');
            console.table(results);
          }
          
          db.end();
          console.log('🔐 Users setup complete!');
        });
      });
    } else {
      console.log(`ℹ️  Users table already has ${results[0].count} users`);
      
      // Show existing users
      db.query('SELECT * FROM users', (err, results) => {
        if (err) {
          console.error('❌ Error fetching users:', err);
        } else {
          console.log('📋 Existing users in database:');
          console.table(results);
        }
        
        db.end();
        console.log('🔐 Users check complete!');
      });
    }
  });
});
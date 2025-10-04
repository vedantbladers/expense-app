// Add role column to users table
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Adding role column to users table...');

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // Add role column
  const addRoleQuery = "ALTER TABLE users ADD COLUMN role ENUM('employee', 'manager', 'admin') DEFAULT 'employee' AFTER country";
  
  db.query(addRoleQuery, (err, result) => {
    if (err && !err.message.includes('Duplicate column')) {
      console.error('❌ Error adding role column:', err.message);
    } else {
      console.log('✅ Role column added successfully');
    }
    
    // Check the updated structure
    db.query('DESCRIBE users', (err, results) => {
      if (err) {
        console.error('❌ Error describing table:', err);
      } else {
        console.log('📋 Updated users table structure:');
        console.table(results);
      }
      
      // Update existing users with default roles
      db.query('UPDATE users SET role = "admin" WHERE email = "admin@company.com"', (err) => {
        if (err) console.error('Error updating admin role:', err);
        else console.log('✅ Updated admin user role');
      });
      
      db.query('UPDATE users SET role = "manager" WHERE email = "manager@company.com"', (err) => {
        if (err) console.error('Error updating manager role:', err);
        else console.log('✅ Updated manager user role');
      });
      
      db.query('UPDATE users SET role = "employee" WHERE email = "employee@company.com"', (err) => {
        if (err) console.error('Error updating employee role:', err);
        else console.log('✅ Updated employee user role');
        
        db.end();
        console.log('🔐 Users table role update complete!');
      });
    });
  });
});
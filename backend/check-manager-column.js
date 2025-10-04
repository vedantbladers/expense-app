import mysql from 'mysql2';

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

// Check if manager column exists and add it if not
db.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    return;
  }
  
  console.log('Connected to MySQL');
  
  // Check current table structure
  db.query('DESCRIBE users', (err, results) => {
    if (err) {
      console.error('Error describing table:', err);
      return;
    }
    
    console.log('Current users table structure:');
    console.table(results);
    
    // Check if manager column exists
    const hasManagerColumn = results.some(column => column.Field === 'manager');
    
    if (!hasManagerColumn) {
      console.log('Manager column not found. Adding it...');
      
      // Add manager column
      db.query('ALTER TABLE users ADD COLUMN manager VARCHAR(255) DEFAULT NULL AFTER role', (err, result) => {
        if (err) {
          console.error('Error adding manager column:', err);
        } else {
          console.log('Manager column added successfully');
          
          // Update some sample managers
          db.query(`
            UPDATE users SET manager = CASE 
            WHEN role = 'employee' THEN 'Manager User'
            WHEN role = 'manager' THEN 'Admin User'
            WHEN role = 'admin' THEN 'CEO'
            ELSE 'Not Assigned'
            END
          `, (err, result) => {
            if (err) {
              console.error('Error updating managers:', err);
            } else {
              console.log('Sample managers assigned');
            }
            db.end();
          });
        }
      });
    } else {
      console.log('Manager column already exists');
      
      // Show current data
      db.query('SELECT id, name, email, role, manager FROM users', (err, results) => {
        if (err) {
          console.error('Error fetching users:', err);
        } else {
          console.log('Current users:');
          console.table(results);
        }
        db.end();
      });
    }
  });
});
import mysql from 'mysql2';

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

// Clean up fake manager data
db.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    return;
  }
  
  console.log('Connected to MySQL');
  
  // First, let's see current data
  db.query('SELECT id, name, email, role, manager FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return;
    }
    
    console.log('Current users with managers:');
    console.table(results);
    
    // Update manager assignments to be more realistic or null
    // Set managers to null for now, or assign real users as managers
    db.query(`
      UPDATE users SET manager = CASE 
      WHEN role = 'admin' THEN NULL
      WHEN role = 'manager' THEN NULL  
      WHEN role = 'employee' THEN NULL
      ELSE NULL
      END
    `, (err, result) => {
      if (err) {
        console.error('Error updating managers:', err);
      } else {
        console.log('Manager assignments cleared');
        
        // Show updated data
        db.query('SELECT id, name, email, role, manager FROM users', (err, results) => {
          if (err) {
            console.error('Error fetching users:', err);
          } else {
            console.log('Updated users:');
            console.table(results);
          }
          db.end();
        });
      }
    });
  });
});
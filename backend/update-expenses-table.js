// Update expenses table to add review tracking columns
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Updating expenses table for manager reviews...');

const alterQueries = [
  "ALTER TABLE expenses ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(100) AFTER status",
  "ALTER TABLE expenses ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP NULL AFTER reviewed_by"
];

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // Execute each ALTER query
  let completed = 0;
  
  alterQueries.forEach((query, index) => {
    // Use simpler syntax for MySQL
    const simpleQuery = query.replace('IF NOT EXISTS ', '');
    
    db.query(simpleQuery, (err, result) => {
      if (err && !err.message.includes('Duplicate column')) {
        console.error(`❌ Error with query ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Query ${index + 1} completed`);
      }
      
      completed++;
      
      if (completed === alterQueries.length) {
        // Check the updated structure
        db.query('DESCRIBE expenses', (err, results) => {
          if (err) {
            console.error('❌ Error describing table:', err);
          } else {
            console.log('📋 Updated expenses table structure:');
            console.table(results);
          }
          
          db.end();
          console.log('🔐 Expenses table update complete!');
        });
      }
    });
  });
});
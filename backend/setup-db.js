// Database setup script - creates the expenses table
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

console.log('Setting up database...');

const createTableSQL = `
CREATE TABLE IF NOT EXISTS expenses (
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
)`;

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  
  console.log('✅ Connected to MySQL');
  
  // Create the expenses table
  db.query(createTableSQL, (err, result) => {
    if (err) {
      console.error('❌ Error creating table:', err);
      return;
    }
    
    console.log('✅ Expenses table created successfully!');
    
    // Insert some sample data
    const sampleExpenses = [
      {
        description: 'Office Supplies',
        date: '2024-10-01',
        paidBy: 'John Doe',
        category: 'Office',
        remarks: 'Stationery and printer paper',
        amount: 45.50,
        currency: 'USD'
      },
      {
        description: 'Team Lunch',
        date: '2024-10-02', 
        paidBy: 'Jane Smith',
        category: 'Meals',
        remarks: 'Monthly team building lunch',
        amount: 120.00,
        currency: 'USD'
      },
      {
        description: 'Software License',
        date: '2024-10-03',
        paidBy: 'Mike Johnson',
        category: 'Software',
        remarks: 'Annual subscription renewal',
        amount: 299.99,
        currency: 'USD'
      }
    ];
    
    // Insert sample data
    const insertSQL = 'INSERT INTO expenses (description, date, paidBy, category, remarks, amount, currency) VALUES ?';
    const values = sampleExpenses.map(expense => [
      expense.description,
      expense.date,
      expense.paidBy,
      expense.category,
      expense.remarks,
      expense.amount,
      expense.currency
    ]);
    
    db.query(insertSQL, [values], (err, result) => {
      if (err) {
        console.error('❌ Error inserting sample data:', err);
      } else {
        console.log(`✅ Inserted ${result.affectedRows} sample expenses`);
      }
      
      // Verify the data
      db.query('SELECT * FROM expenses', (err, results) => {
        if (err) {
          console.error('❌ Error fetching data:', err);
        } else {
          console.log('📋 Current expenses in database:');
          console.table(results);
        }
        
        db.end();
        console.log('🔐 Database setup complete!');
      });
    });
  });
});
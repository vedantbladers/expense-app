import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// For file uploads
const upload = multer({ dest: 'uploads/' });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syswow@1234',
  database: 'expense'
});

// Test connection
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// User Registration (Signup)
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, country, role } = req.body;
  
  console.log('Signup attempt:', { name, email, country, role });
  
  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'All fields are required', 
      message: 'Please fill in all required fields including role' 
    });
  }

  // Validate role
  if (!['employee', 'manager', 'admin'].includes(role)) {
    return res.status(400).json({ 
      error: 'Invalid role', 
      message: 'Role must be employee, manager, or admin' 
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format', 
      message: 'Please enter a valid email address' 
    });
  }
  
  // Check if user already exists
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error during signup:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Something went wrong. Please try again.' 
      });
    }
    
    if (results.length > 0) {
      return res.status(409).json({ 
        error: 'User already exists', 
        message: 'An account with this email already exists' 
      });
    }
    
    // Insert new user
    db.query(
      'INSERT INTO users (name, email, password, country, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, country || 'Not specified', role],
      (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ 
            error: 'Failed to create account', 
            message: 'Something went wrong. Please try again.' 
          });
        }
        
        console.log('User created successfully:', result.insertId);
        res.status(201).json({ 
          success: true, 
          message: 'Account created successfully!',
          userId: result.insertId,
          user: { 
            id: result.insertId, 
            name, 
            email, 
            country: country || 'Not specified',
            role: role
          }
        });
      }
    );
  });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email });
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required', 
      message: 'Please enter both email and password' 
    });
  }
  
  // Find user by email and password
  db.query(
    'SELECT id, name, email, country, role FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({ 
          error: 'Database error', 
          message: 'Something went wrong. Please try again.' 
        });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ 
          error: 'Invalid credentials', 
          message: 'Invalid email or password' 
        });
      }
      
      const user = results[0];
      console.log('User logged in successfully:', user.id);
      
      res.json({ 
        success: true, 
        message: 'Login successful!',
        user: user
      });
    }
  );
});

// Generate random password function
function generateRandomPassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Send New Password endpoint
app.post('/api/auth/send-password', (req, res) => {
  const { email, userName } = req.body;
  
  console.log('Send new password request for:', email);
  
  // Basic validation
  if (!email) {
    return res.status(400).json({ 
      error: 'Email is required', 
      message: 'Please provide email address' 
    });
  }
  
  // Check if user exists
  db.query('SELECT id, name FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error during send password:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Something went wrong. Please try again.' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        error: 'User not found', 
        message: 'No user found with this email address' 
      });
    }
    
    const user = results[0];
    const newPassword = generateRandomPassword(10);
    
    console.log('Generated new password for user:', user.id);
    
    // Update password in database
    db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ 
          error: 'Failed to update password', 
          message: 'Could not update password in database' 
        });
      }
      
      console.log('Password updated successfully for user:', user.id);
      
      // In a real application, you would send an email here
      // For demo purposes, we'll return the password in the response
      // DO NOT do this in production - passwords should never be returned in API responses
      
      res.json({ 
        success: true, 
        message: `New password generated and sent to ${email}`,
        // REMOVE THIS IN PRODUCTION - only for demo
        generatedPassword: newPassword,
        userName: user.name
      });
    });
  });
});

// Forgot Password endpoint (legacy - keeping for compatibility)
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  console.log('Forgot password request for:', email);
  
  // Basic validation
  if (!email) {
    return res.status(400).json({ 
      error: 'Email is required', 
      message: 'Please provide your email address' 
    });
  }
  
  // Check if user exists
  db.query('SELECT id, name FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error during forgot password:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        message: 'Something went wrong. Please try again.' 
      });
    }
    
    if (results.length === 0) {
      // For security, don't reveal if email exists or not
      return res.json({ 
        success: true, 
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      });
    }
    
    const user = results[0];
    console.log('Password reset requested for user:', user.id);
    
    // For demo purposes, just return success
    res.json({ 
      success: true, 
      message: 'Password reset link sent to your email address!'
    });
  });
});

// Get all users endpoint
app.get('/api/users', (req, res) => {
  console.log('GET /api/users requested');
  
  db.query('SELECT id, name, email, role, country, manager FROM users ORDER BY name', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Add default values for missing fields
    const usersWithDefaults = results.map(user => ({
      ...user,
      role: user.role || 'employee',
      manager: user.manager || 'Not Assigned'
    }));
    
    console.log(`Found ${results.length} users`);
    console.log('Sample user:', usersWithDefaults[0]);
    res.json(usersWithDefaults);
  });
});

// Expense submission endpoint
app.post('/api/expenses', upload.single('receipt'), (req, res) => {
  const { description, date, paidBy, category, remarks, amount, currency } = req.body;
  const receipt = req.file ? req.file.filename : null;

  db.query(
    'INSERT INTO expenses (description, date, paidBy, category, remarks, amount, currency, receipt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [description, date, paidBy, category, remarks, amount, currency, receipt],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// Get all expenses
app.get('/api/expenses', (req, res) => {
  console.log('GET /api/expenses requested');
  db.query('SELECT * FROM expenses ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Found ${results.length} expenses`);
    res.json(results);
  });
});

// Delete an expense
app.delete('/api/expenses/:id', (req, res) => {
  const expenseId = req.params.id;
  
  db.query('DELETE FROM expenses WHERE id = ?', [expenseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ success: true, message: 'Expense deleted successfully' });
  });
});

// Get expense count
app.get('/api/expenses/count', (req, res) => {
  db.query('SELECT COUNT(*) as count, SUM(amount) as total FROM expenses', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Update expense status (approve/reject)
app.put('/api/expenses/:id/status', (req, res) => {
  const expenseId = req.params.id;
  const { status, reviewedBy } = req.body;
  
  console.log(`Updating expense ${expenseId} status to ${status}`);
  
  // Validate status
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status', 
      message: 'Status must be pending, approved, or rejected' 
    });
  }
  
  db.query(
    'UPDATE expenses SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
    [status, reviewedBy || null, expenseId],
    (err, result) => {
      if (err) {
        console.error('Error updating expense status:', err);
        return res.status(500).json({ 
          error: 'Database error', 
          message: 'Failed to update expense status' 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Expense not found', 
          message: 'No expense found with that ID' 
        });
      }
      
      console.log(`Expense ${expenseId} status updated to ${status}`);
      res.json({ 
        success: true, 
        message: `Expense ${status} successfully!`,
        expenseId: expenseId,
        status: status
      });
    }
  );
});

// Get expenses by status (for manager view)
app.get('/api/expenses/status/:status', (req, res) => {
  const status = req.params.status;
  console.log(`GET /api/expenses/status/${status} requested`);
  
  db.query('SELECT * FROM expenses WHERE status = ? ORDER BY created_at DESC', [status], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Found ${results.length} expenses with status ${status}`);
    res.json(results);
  });
});

// Get all users (for admin)
app.get('/api/users', (req, res) => {
  console.log('GET /api/users requested');
  db.query('SELECT id, name, email, country FROM users ORDER BY id', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Found ${results.length} users`);
    res.json(results);
  });
});

// Receipt parsing endpoint
app.post('/api/parse-receipt', upload.single('receipt'), async (req, res) => {
  console.log('POST /api/parse-receipt requested');
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    // Create a temporary Python script to call the receipt parser
    // Create the temporary Python script in the p1 directory
    const p1Dir = path.join(process.cwd(), '..', 'p1');
    const tempScriptPath = path.join(p1Dir, 'temp_parse_receipt.py');
    const pythonScript = `
import sys
import os
import asyncio
import json
from receipt_parser import ReceiptParser
from dotenv import load_dotenv

async def main():
    # Load environment variables
    load_dotenv('.env')
    
    # Get the API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print(json.dumps({'success': False, 'error': 'GEMINI_API_KEY not found'}))
        return
    
    # Initialize parser
    parser = ReceiptParser(api_key)
    
    # Read the uploaded file
    file_path = '${req.file.path.replace(/\\/g, '/')}'
    with open(file_path, 'rb') as f:
        image_bytes = f.read()
    
    # Parse the receipt
    result = await parser.parse_receipt(image_bytes)
    
    if result and 'error' not in result:
        print(json.dumps({'success': True, 'data': result}))
    else:
        print(json.dumps({'success': False, 'error': result.get('error', 'Failed to parse receipt')}))

if __name__ == '__main__':
    asyncio.run(main())
`.trim();

    // Write the temporary script
    fs.writeFileSync(tempScriptPath, pythonScript);

    // Execute the Python script from the p1 directory
    const pythonExecutable = 'E:/IIT_HACKATHON/.venv/Scripts/python.exe';
    const python = spawn(pythonExecutable, [tempScriptPath], {
      cwd: p1Dir
    });

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      // Clean up temporary files
      try {
        fs.unlinkSync(tempScriptPath);
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error cleaning up temp files:', err);
      }

      if (code !== 0) {
        console.error('Python script error:', errorOutput);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to parse receipt: ' + errorOutput 
        });
      }

      try {
        const result = JSON.parse(output.trim());
        res.json(result);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError, 'Output:', output);
        res.status(500).json({ 
          success: false, 
          error: 'Invalid response from receipt parser' 
        });
      }
    });

  } catch (error) {
    console.error('Receipt parsing error:', error);
    // Clean up uploaded file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error cleaning up uploaded file:', err);
      }
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log('Backend server running on port 5000'));
# Expense Management System

A comprehensive full-stack expense management application with AI-powered receipt parsing, role-based authentication, and approval workflows. Built with React, Node.js, Python FastAPI, and MySQL.

## Project Structure

```
expense-app/
├── backend/              # Node.js Express server
│   ├── index.js          # Main server with receipt parsing integration
│   ├── package.json      # Backend dependencies
│   ├── setup-db.js       # Database schema setup
│   ├── setup-users.js    # Initial user data setup
│   └── uploads/          # File upload directory
├── p1/                   # Python AI receipt parser
│   ├── main.py           # FastAPI server for receipt parsing
│   ├── receipt_parser.py # Google Gemini AI integration
│   ├── requirements.txt  # Python dependencies
│   └── .env             # API keys and configuration
├── src/                  # React frontend source
│   ├── components/       # Reusable components
│   │   └── RoleBasedNavbar.jsx
│   ├── pages/           # Application pages
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NEWreceipt.jsx    # Receipt upload with AI parsing
│   │   ├── managerView.jsx   # Manager approval dashboard
│   │   ├── AdminUserManagement.jsx
│   │   └── forgotPassword.jsx # User management page
│   └── App.jsx          # Main app with routing
├── public/              # Static assets
└── package.json         # Main project configuration
```

## Features

### Core Functionality
- **AI-Powered Receipt Parsing**: Upload receipt images and automatically extract merchant, date, amount, tax, and itemized details using Google Gemini AI
- **Role-Based Authentication**: Employee, Manager, and Admin roles with specific permissions
- **Expense Management**: Create, submit, and track expenses with receipt attachments
- **Approval Workflow**: Manager approval system for expense submissions
- **User Management**: Admin panel for user creation and password management

### User Roles & Permissions
- **Employee**: Submit expenses, upload receipts, view personal dashboard
- **Manager**: View and approve/reject employee expenses, access approval dashboard
- **Admin**: Full user management, password generation, system administration

### Advanced Features
- **Smart Form Auto-Fill**: Automatically populate expense forms with AI-extracted receipt data
- **Real-time Notifications**: Toast notifications for all user actions
- **Random Password Generation**: Secure password generation for new users
- **Receipt Data Validation**: Review and modify AI-extracted data before submission
- **Responsive Design**: Mobile-friendly interface with DaisyUI components

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.11 or higher)
- **MySQL Server** (v8.0 or higher)
- **Google Gemini API Key** (for receipt parsing)

### Environment Setup

#### 1. Database Configuration
Create a MySQL database and update credentials in `backend/index.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'expense'
});
```

#### 2. Google Gemini API Setup
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the API key in `p1/.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation

#### 1. Frontend & Backend Dependencies
```bash
# Install main project dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Python Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install Python dependencies
cd p1
pip install -r requirements.txt
cd ..
```

#### 3. Database Initialization
```bash
# Setup database schema
cd backend
node setup-db.js

# Setup initial users (optional)
node setup-users.js
cd ..
```

### Running the Application

#### Development Mode

1. **Start Backend Server** (Terminal 1):
```bash
cd backend
node index.js
# Server runs on http://localhost:5000
```

2. **Start Frontend Server** (Terminal 2):
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Python Environment** (Integrated):
The receipt parsing functionality is integrated into the Node.js backend and automatically uses the Python virtual environment.

#### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Login Page**: http://localhost:5173/login
- **New Receipt**: http://localhost:5173/new-receipt

#### Default Users
After running `setup-users.js`, you can login with:
- **Admin**: admin@company.com / password123
- **Manager**: manager@company.com / password123  
- **Employee**: employee@company.com / password123

### Build for Production
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/send-password` - Generate and send new password

### Expenses
- `POST /api/expenses` - Submit new expense with receipt upload
- `GET /api/expenses` - Get all expenses
- `PUT /api/expenses/:id/status` - Update expense status (approve/reject)
- `GET /api/expenses/status/:status` - Get expenses by status

### Receipt Processing
- `POST /api/parse-receipt` - Parse receipt image using AI (returns extracted data)

### User Management
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user information

## Technologies Used

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library for Tailwind
- **React Router DOM** - Client-side routing
- **React Hot Toast** - Elegant notifications
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL2** - MySQL database driver
- **Multer** - Multipart form data handling
- **CORS** - Cross-origin resource sharing

### AI & Machine Learning
- **Python 3.11+** - Core Python runtime
- **Google Gemini AI** - Advanced AI for receipt text extraction
- **FastAPI** - Modern Python web framework (integrated)
- **Asyncio** - Asynchronous programming support

### Database
- **MySQL** - Relational database management
- **Database Schema**: Users, Expenses, Roles, Manager relationships

## Application Flow

### Receipt Processing Workflow
1. **Upload**: User uploads receipt image through the web interface
2. **AI Analysis**: Google Gemini AI extracts merchant, date, amount, tax, and items
3. **Auto-Fill**: Extracted data automatically populates the expense form
4. **Review**: User reviews and modifies the extracted information
5. **Submit**: Expense is submitted to the database for approval

### Approval Workflow
1. **Employee** submits expense with receipt
2. **Manager** receives notification and reviews expense
3. **Manager** approves or rejects with comments
4. **Employee** receives status update notification

### User Management
1. **Admin** can create new users
2. **Random passwords** are generated and shared
3. **Role-based access** controls feature visibility
4. **Manager assignments** enable approval hierarchies

## Features in Detail

### Smart Receipt Processing
- Supports JPG, PNG, PDF receipt formats
- Extracts merchant name, transaction date, total amount
- Identifies individual line items with prices
- Detects tax amounts and discounts
- Handles multiple currencies (USD, EUR, INR, GBP)

### Role-Based Security
- **Session Management**: Secure localStorage-based authentication
- **Route Protection**: Role-based access to different pages
- **Dynamic Navigation**: Navbar changes based on user role
- **Permission Checks**: API endpoints validate user permissions

### Responsive Design
- Mobile-first responsive layout
- Touch-friendly interface elements
- Progressive Web App (PWA) ready
- Dark/light theme support via DaisyUI

## Troubleshooting

### Common Issues
1. **MySQL Connection Error**: Verify database credentials and server status
2. **Gemini API Error**: Check API key validity and internet connection
3. **Python Import Error**: Ensure virtual environment is activated
4. **File Upload Error**: Check uploads directory permissions

### Debug Mode
Enable detailed logging by setting environment variables:
```bash
# Backend debugging
DEBUG=expense-app:*

# Python debugging  
PYTHONPATH=./p1
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for advanced receipt processing
- DaisyUI team for beautiful component library
- React and Vite communities for excellent development tools

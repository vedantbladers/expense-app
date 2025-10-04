# Expense App Backend

Backend server for the Expense Management Application.

## Setup

1. Make sure you have MySQL installed and running
2. Create a database named `expense`
3. Update the database credentials in `index.js` if needed
4. Install dependencies: `npm install`
5. Start the server: `npm start` or `npm run dev` for development

## Database Configuration

- Host: localhost
- User: root
- Password: Syswow@1234
- Database: expense

## API Endpoints

- `POST /api/expenses` - Submit a new expense (with file upload support)
- `GET /api/expenses` - Get all expenses

## File Uploads

Receipt files are stored in the `uploads/` directory.

## Port

The server runs on port 5000.
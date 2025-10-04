// Simple test server to serve the database test page
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static(__dirname));

// Serve the test page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-database.html'));
});

// Serve the table view page
app.get('/table', (req, res) => {
    res.sendFile(path.join(__dirname, 'view-table.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Test server running at http://localhost:${PORT}`);
    console.log('📋 Open this URL in your browser to test the database');
});
const express = require('express');
const modeRoutes = require('./routes/modeRoutes'); // Import your route module
const cors = require('cors');
const multer = require('multer');

const app = express(); // Create an instance of express

// Set up storage options for multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Initialize multer with storage options

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', modeRoutes); // Use your mode routes

app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;

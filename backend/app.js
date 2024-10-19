const express = require('express');
const modeRoutes = require('./routes/modeRoutes');
const app = express();

app.use(express.json());

// Routes
// app.use('/api/modes', modeRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;

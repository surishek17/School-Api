const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes');
const db = require('./db/connection');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Test Database Connection
db.getConnection()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the application if the database connection fails
    });

// Routes
app.use('/api/school_api', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

// Create an Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// SQL Server configuration
const dbConfig = {
    server: '(localdb)\MSSQLLocalDB',
    database: 'SchoolFeesDatabase',
    options: {
        trustServerCertificate: true // Change to false if using a trusted certificate
    }
};

// Connect to MS SQL Server
sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to MSSQL');
    }
}).catch(err => {
    console.error('Database connection failed: ', err);
});

// Endpoint to handle user registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password) // Note: In a real app, hash the password
            .query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)');
        
        res.status(200).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error registering user', error: err });
    }
});

// Endpoint to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Users WHERE email = @email AND password = @password'); 

        if (result.recordset.length > 0) {
            res.status(200).send({ message: 'Login successful', user: result.recordset[0] });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error logging in', error: err });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
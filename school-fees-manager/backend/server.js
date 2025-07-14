const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
  user: 'your_db_user',
  password: 'your_db_password',
  server: 'your_db_server',
  database: 'your_db_name',
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

// Connect to the database
sql.connect(dbConfig).then(pool => {
  if (pool.connected) {
    console.log('Connected to the database');
  }

  // API endpoint to handle login and save user info
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Replace this with your authentication logic
    const isAuthenticated = true; 

    if (isAuthenticated) {
      const query = `INSERT INTO UserInfo (email, password) VALUES (@Email, @Password)`;
      try {
        const request = pool.request();
        request.input('Email', sql.VarChar, email);
        request.input('Password', sql.VarChar, password);
        await request.query(query);
        res.status(200).send('User info saved successfully');
      } catch (err) {
        res.status(500).send('Error saving user info');
      }
    } else {
      res.status(401).send('Authentication failed');
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
});

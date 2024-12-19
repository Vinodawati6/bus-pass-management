// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Mock database
const db = {
  users: [],
  passes: [],
  applications: []
};

// Routes

// User Registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (db.users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Email already exists!' });
  }

  const newUser = { id: db.users.length + 1, name, email, password };
  db.users.push(newUser);

  res.status(201).json({ message: 'User registered successfully!' });
});

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password!' });
  }

  res.json({ message: 'Login successful!', userId: user.id });
});

// Pass Application
app.post('/apply-pass', (req, res) => {
  const { userId, type, from, to, validity, amount } = req.body;

  if (!db.users.some(user => user.id === userId)) {
    return res.status(404).json({ message: 'User not found!' });
  }

  const newPass = {
    id: db.passes.length + 1,
    userId,
    type,
    from,
    to,
    validity,
    amount,
    status: 'Pending'
  };

  db.passes.push(newPass);
  res.status(201).json({ message: 'Pass application submitted!', passId: newPass.id });
});

// Check Application Status
app.get('/status/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const application = db.passes.find(pass => pass.id === parseInt(applicationId));

  if (!application) {
    return res.status(404).json({ message: 'Application not found!' });
  }

  res.json({ status: application.status });
});

// Download Pass
app.get('/download/:passId', (req, res) => {
  const { passId } = req.params;
  const pass = db.passes.find(pass => pass.id === parseInt(passId));

  if (!pass) {
    return res.status(404).json({ message: 'Pass not found!' });
  }

  res.json({ pass });
});

// Search Bus Routes
app.post('/search-routes', (req, res) => {
  const { from, to } = req.body;

  const routes = [
    { from: 'Vijayanagar', to: 'Yashavantpura', route: 'Route 1' },
    { from: 'Kengeri', to: 'Kengeri TTMC', route: 'Route 2' }
  ];

  const result = routes.filter(route => route.from === from && route.to === to);

  if (result.length === 0) {
    return res.status(404).json({ message: 'No routes found!' });
  }

  res.json({ routes: result });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// getPostDemo.js - enhanced demo
const path = require('path');
const express = require('express');

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware (no extra dependency)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

// In-memory store for demo purposes
const registrations = [];
let nextId = 1;

function validateEmail(email) {
  // Simple email regex for demo (not for production use)
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}

// Home page with links
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Express.js GET & POST Demo</h1>
    <p><a href="/register">Open registration form</a></p>
    <p><a href="/users">View registered users (JSON)</a></p>
  `);
});

// Serve the HTML registration form
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Example GET request with query parameter
app.get('/user', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`<h2>Hello, ${name}! This is a GET request.</h2>`);
});

// Create a registration (accepts form or JSON)
app.post('/register', (req, res, next) => {
  try {
    const { name, email } = req.body || {};

    const errors = [];
    if (!name || String(name).trim().length === 0) errors.push('Name is required');
    if (!email || !validateEmail(email)) errors.push('A valid email is required');

    if (errors.length) {
      // Respond with JSON for API clients, or simple HTML for browsers
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(400).json({ success: false, errors });
      }
      return res.status(400).send(`
        <h2>Validation failed</h2>
        <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
        <p><a href="/register">Back to form</a></p>
      `);
    }

    const record = { id: nextId++, name: String(name).trim(), email: String(email).trim(), createdAt: new Date().toISOString() };
    registrations.push(record);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(201).json({ success: true, user: record });
    }

    // For browser clients, return a friendly HTML confirmation
    res.status(201).send(`
      <h2>Registration Successful ✅</h2>
      <p><strong>Name:</strong> ${record.name}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><a href="/users">View all registrations (JSON)</a></p>
      <p><a href="/register">Register another</a></p>
    `);
  } catch (err) {
    next(err);
  }
});

// Return all registrations as JSON
app.get('/users', (req, res) => {
  // If the client prefers HTML, render a tiny table
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const rows = registrations.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.createdAt}</td></tr>`).join('');
    return res.send(`
      <h2>Registered Users</h2>
      <table border="1" cellpadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Created</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="4">No registrations</td></tr>'}</tbody>
      </table>
      <p><a href="/register">Register someone</a></p>
    `);
  }
  res.json({ count: registrations.length, users: registrations });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h2>404 - Not Found</h2><p>The requested resource was not found.</p>');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).send('<h2>500 - Internal Server Error</h2><p>Something went wrong.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

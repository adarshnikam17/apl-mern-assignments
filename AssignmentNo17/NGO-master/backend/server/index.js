const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Donation = require('../models/Donation');
const Contact = require('../models/Contact');

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Fix: Add proper CORS configuration (allow frontend ports)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // for Vite frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Donation submission route
app.post('/api/donations', async (req, res) => {
  try {
    const { name, phone, date, location, donationType, amount } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    if (!location || location.trim() === '') {
      return res.status(400).json({ error: 'Location is required' });
    }
    if (!donationType) {
      return res.status(400).json({ error: 'Donation type is required' });
    }
    if (donationType === 'money' && (!amount || amount <= 0)) {
      return res.status(400).json({ error: 'Valid donation amount is required' });
    }

    const donation = new Donation({
      name,
      phone,
      date,
      location,
      donationType,
      amount: donationType === 'money' ? amount : undefined,
    });

    await donation.save();
    res.status(201).json({ message: 'Donation submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving donation:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// ✅ Contact submission route
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// ✅ Health check route (optional for testing)
app.get('/', (req, res) => {
  res.send('✅ NGOConnect backend is running');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

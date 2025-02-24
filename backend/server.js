// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);



// Connect to MongoDB using your connection string from your .env file
mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

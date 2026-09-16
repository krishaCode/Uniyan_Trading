require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/video-access', require('./routes/videoAccessRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Health check and root status
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 TradNex API Backend is Running',
    database: 'MongoDB Atlas Connected',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      videos: '/api/videos',
      videoAccess: '/api/video-access',
      news: '/api/news',
      contact: '/api/contact'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TradNex API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 TradNex Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer();

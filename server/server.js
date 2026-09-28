require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// CORS - allow Vercel frontend domain + localhost for dev
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now (tighten later)
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection middleware — ensures DB is connected before handling any request
// The connection is cached globally so it only connects once per serverless instance
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Error in middleware:', error.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/video-access', require('./routes/videoAccessRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

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
      contact: '/api/contact',
      reviews: '/api/reviews'
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

// Export the app for Vercel Serverless Functions
module.exports = app;

// Only start listening when NOT on Vercel (i.e., local development)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 TradNex Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  };
  startServer();
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const contractRoutes = require('./routes/contract.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Robust CORS configuration for localhost & Vercel deployments
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow localhost or any vercel.app deployment
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('.vercel.app') ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for all clients
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '⚖️ Lexora API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);

// 404 & Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n⚖️  Lexora API running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

const express = require('express');
const { initCoreDb } = require('./db/tenantManager');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

console.log('ALLOWED_ORIGINS:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    console.log('Incoming origin:', origin);
    // Allow no-origin requests (mobile, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow localhost
    if (origin.includes('localhost')) return callback(null, true);
    // Allow all vercel.app domains for this project
    if (origin.includes('vercel.app')) return callback(null, true);
    // Check explicit allowed origins
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('Blocked by CORS:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initCoreDb();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

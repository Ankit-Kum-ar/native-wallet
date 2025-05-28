const express = require('express');
const { PORT, NODE_ENV } = require('./config/env');
const { connectDB } = require('./config/db');
const transactionsRouter = require('./routes/transactions.route');
const rateLimiter = require('./middlewares/rateLimiter');
const job = require('./config/cron');

const app = express();

if (NODE_ENV === "production") job.start(); // Start the cron job if in production environment

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for rate limiting
app.use(rateLimiter)

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Expense Tracker API',
  });
}
);
 
// Routes
app.use('/api/v1/transactions', transactionsRouter);

connectDB().then(() => {
  // Start the server after successful database connection
  app.listen(PORT, () => {
    console.log(`Server is running on URL: http://localhost:${PORT}`);
  });
}).catch((error) => {
    console.error('Failed to start server due to database connection error:', error);
    process.exit(1); // Exit the process with a failure code
});
const { neon } = require('@neondatabase/serverless');
const { POSTGRESS_URL } = require('./env');

// Initialize the Neon database connection 
const sql = neon(POSTGRESS_URL);

async function connectDB() {
    try {
        // Attempt to connect to the database
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL, 
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

        // 10,2 is the precision and scale for the amount field, meaning it can store values up to 10 digits long, with 2 digits after the decimal point.

        console.log('Database connection successful');
    } catch (error) {
        // Log any errors that occur during the connection attempt
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with a failure code
    }
}

module.exports = { sql, connectDB };
const { sql } = require("../config/db");

const createTransaction = async (req, res) => {
    const { user_id, title, amount, category } = req.body;

    // Validate input data
    if (!user_id || !title || amount === undefined || !category) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields: user_id, title, amount, category'
        });
    }

    // Check if amount is a valid number
    if (typeof amount !== 'number' || isNaN(amount)) {
        return res.status(400).json({
            status: 'error',
            message: 'Amount must be a valid number'
        });
    }

    // Check if category is a valid string
    if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Category must be a non-empty string'
        });
    }

    // Check if user_id is a valid string
    if (typeof user_id !== 'string' || user_id.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'User ID must be a non-empty string'
        });
    }

    // Insert the transaction into the database
    try {

        // Check if entry already exists
        const existingTransaction = await sql`SELECT * FROM transactions WHERE user_id = ${user_id} AND title = ${title} AND amount = ${amount} AND category = ${category}`;
        if (existingTransaction.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'Transaction already exists'
            });
        }

        // Insert the new transaction
        const result = await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
        res.status(201).json({
            status: 'success',
            message: 'Transaction created successfully',
            data: result[0] // Return the created transaction
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
        res.status(200).json({
            status: 'success',
            data: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

const getTransactionById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`;
        if (transaction.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Transaction not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: transaction // Return the transaction data
        });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid transaction ID'
        });
    }

    try {
        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if (result.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Transaction not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Transaction deleted successfully',
            data: result[0] // Return the deleted transaction
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
};

const getSummaryByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Validate the user_id
        if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID'
            });
        }

        // Fetch the balance, income, and expenses for the user
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${user_id} AND amount > 0
        `;

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${user_id} AND amount < 0
        `;

        // COALESCE is used to return 0 if the sum is null (i.e., no transactions found)
        if (balanceResult.length === 0 || incomeResult.length === 0 || expensesResult.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No transactions found for the user'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                balance: balanceResult[0]?.balance || 0,
                income: incomeResult[0]?.income || 0,
                expenses: expensesResult[0]?.expenses || 0
            }
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    deleteTransaction,
    getSummaryByUserId
};
const express = require('express');
const { createTransaction, getAllTransactions, getTransactionById, deleteTransaction, getSummaryByUserId } = require('../controllers/transactions.controller');
const transactionsRouter = express.Router();

transactionsRouter.post('/create', createTransaction);
transactionsRouter.get('/', getAllTransactions);
transactionsRouter.get('/:user_id', getTransactionById);
transactionsRouter.delete('/:id', deleteTransaction); 

transactionsRouter.get('/summary/:user_id', getSummaryByUserId);

module.exports = transactionsRouter;
const express = require('express');
const {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controller/transactionsController');
const router = express.Router();

router.post('/create', addTransaction);
router.get('/all', fetchAllTransactions);
router.get('/:id', fetchTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;

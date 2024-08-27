const express = require('express');
const {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById,
  fetchTransactionsByChildIdAndMonth
} = require('../controller/transactionsController');
const router = express.Router();

router.post('/create', addTransaction);
router.get('/all', fetchAllTransactions);
router.get('/:id', fetchTransactionById);
router.get('/child/:childId/month/:month', fetchTransactionsByChildIdAndMonth);

module.exports = router;

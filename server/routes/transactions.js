const express = require('express');
const {
  addTransaction,
  fetchAllTransactions,
  fetchTransactionById
} = require('../controller/transactionsController');
const router = express.Router();

router.post('/create', addTransaction);
router.get('/all', fetchAllTransactions);
router.get('/:id', fetchTransactionById);

module.exports = router;

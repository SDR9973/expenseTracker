const express = require('express');
const {
  addWallet,
  fetchAllWallets,
  fetchWalletById
} = require('../controller/walletsController');
const router = express.Router();

router.post('/create', addWallet);
router.get('/all', fetchAllWallets);
router.get('/:id', fetchWalletById);

module.exports = router;

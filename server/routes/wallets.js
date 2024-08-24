const express = require('express');
const {
  addWallet,
  fetchAllWallets,
  fetchWalletById,
  updateWallet,
  deleteWallet
} = require('../controller/walletsController');
const router = express.Router();

router.post('/create', addWallet);
router.get('/all', fetchAllWallets);
router.get('/:id', fetchWalletById);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

module.exports = router;


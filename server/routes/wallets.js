const express = require('express');
const {
  createWallet,
  getAllWallets,
  getWalletById,
  updateWallet,
  deleteWallet
} = require('../controller/walletsController');
const router = express.Router();

router.post('/create', createWallet);
router.get('/all', getAllWallets);
router.get('/:id', getWalletById);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

module.exports = router;



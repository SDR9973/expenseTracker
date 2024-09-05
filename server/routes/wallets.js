const express = require('express');
const {
  createWallet,
  getAllWallets,
  getAllWalletsByParentId,
  getWalletByChildId,
  updateWallet,
  deleteWallet
} = require('../controller/walletsController');
const router = express.Router();

router.post('/create', createWallet);
router.get('/all', getAllWallets);
router.get('/all/:id', getAllWalletsByParentId);
router.get('/:id', getWalletByChildId);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

module.exports = router;



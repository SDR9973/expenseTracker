const express = require('express');
const {
    // loginParent,
    getParentById,
    getChildrenByParentId,
    fetchAllTransactionsForChildrenByMonth
} = require('../controller/parentsController');
const router = express.Router();

// router.post('/login', loginParent);
router.get('/:id', getParentById);
router.get('/:id/children', getChildrenByParentId);
router.get('/:id/children/transactions', fetchAllTransactionsForChildrenByMonth); // Make sure the function exists

module.exports = router;

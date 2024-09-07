const express = require('express');
const {
    getParentById,
    getChildrenByParentId,
    fetchAllTransactionsForChildrenByMonth
} = require('../controller/parentsController');
const router = express.Router();

router.get('/:id', getParentById);
router.get('/:id/children', getChildrenByParentId);
router.get('/:id/children/transactions/:month', fetchAllTransactionsForChildrenByMonth); 

module.exports = router;

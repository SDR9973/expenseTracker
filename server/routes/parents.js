const express = require('express');
const {
    loginParent,
    getParentById
} = require('../controller/parentsController');
const router = express.Router();

router.post('/login', loginParent);
router.get('/:id', getParentById);

module.exports = router;

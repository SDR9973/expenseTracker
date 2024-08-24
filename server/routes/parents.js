const express = require('express');
const {
    createParent,
    loginParent,
    getParentById
} = require('../controller/parentsController');
const router = express.Router();

router.post('/create', createParent);
router.post('/login', loginParent);
router.get('/:id', getParentById);

module.exports = router;

const express = require('express');
const {
    createParent,
    getAllParents,
    loginParent,
    logoutParent,
    getParentById
} = require('../controller/parentsController');
const router = express.Router();

router.post('/create', createParent);
router.get('/all', getAllParents);
router.post('/login', loginParent);
router.post('/logout', logoutParent);
router.get('/:id', getParentById);

module.exports = router;

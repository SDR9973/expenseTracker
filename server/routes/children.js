const express = require('express');
const {
  addChild,
  fetchAllChildren,
  fetchChildById
} = require('../controller/childrenController');
const router = express.Router();

router.post('/create', addChild);
router.get('/all', fetchAllChildren);
router.get('/:id', fetchChildById);

module.exports = router;

const express = require('express');
const {
  addChild,
  fetchChildById
} = require('../controller/childrenController');
const router = express.Router();

router.post('/create', addChild);
router.get('/:id', fetchChildById);

module.exports = router;

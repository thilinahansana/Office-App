const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { list } = require('../controllers/entrepreneurSubmissionController');

const router = express.Router();

router.get('/', asyncHandler(list));

module.exports = router;

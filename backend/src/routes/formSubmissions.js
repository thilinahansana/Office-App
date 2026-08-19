const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { list } = require('../controllers/formSubmissionController');

const router = express.Router();

router.get('/', asyncHandler(list));

module.exports = router;

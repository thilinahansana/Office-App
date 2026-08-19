const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', asyncHandler(login));

module.exports = router;

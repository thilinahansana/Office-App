const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { run } = require('../controllers/entrepreneurSyncController');

const router = express.Router();

router.post('/run', asyncHandler(run));

module.exports = router;

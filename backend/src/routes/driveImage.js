const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getThumbnail } = require('../controllers/driveImageController');

const router = express.Router();

// Intentionally not behind requireAuth: <img src> can't send an Authorization
// header, and this only ever proxies to already-public Drive thumbnails.
router.get('/', asyncHandler(getThumbnail));

module.exports = router;

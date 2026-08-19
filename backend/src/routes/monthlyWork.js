const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { list, listMonths, create, update, remove } = require('../controllers/monthlyWorkController');

const router = express.Router();

router.get('/', asyncHandler(list));
router.get('/months', asyncHandler(listMonths));
router.post('/', asyncHandler(create));
router.put('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(remove));

module.exports = router;

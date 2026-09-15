const express = require('express');
const { addProgress, getUserProgress, updateProgress, deleteProgress } = require('../controllers/progressController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserProgress);
router.post('/', protect, addProgress);
router.put('/:id', protect, updateProgress);
router.delete('/:id', protect, deleteProgress);

module.exports = router;

const express = require('express');
const { generateWorkout, getWorkoutPlans, deleteWorkoutPlan } = require('../controllers/workoutController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, generateWorkout);
router.get('/', protect, getWorkoutPlans);
router.delete('/:id', protect, deleteWorkoutPlan);

module.exports = router;

const express = require('express');
const { generateMealPlan, getMealPlans, deleteMealPlan } = require('../controllers/mealController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, generateMealPlan);
router.get('/', protect, getMealPlans);
router.delete('/:id', protect, deleteMealPlan);

module.exports = router;

const express = require('express');
const {
  getProfile,
  updateProfile,
  completeWorkout,
  completeMeal,
  changePassword,
  closeChallengePopup,
  closePremiumPopup,
} = require('../controllers/profileController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/workout-complete', protect, completeWorkout);
router.post('/meal-complete', protect, completeMeal);
router.put('/change-password', protect, changePassword);
router.put("/challenge-popup", protect, closeChallengePopup);
router.put("/premium-popup", protect, closePremiumPopup);

module.exports = router;
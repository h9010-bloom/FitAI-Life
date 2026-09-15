const express = require('express');
const {
  saveMembership,
  getMembership,
  checkTrial,
} = require('../controllers/membershipController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/save', protect, saveMembership);
router.get('/', protect, getMembership);
router.get('/check-trial', protect, checkTrial);

module.exports = router;

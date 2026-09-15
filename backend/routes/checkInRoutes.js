const express = require("express");

const {
  getTodayCheckIn,
  getAllCheckIns,
  markPresent,
  completeWorkout,
  completeMeal,
} = require("../controllers/checkInController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllCheckIns);

router.get("/today", protect, getTodayCheckIn);

router.post("/present", protect, markPresent);

router.put("/workout", protect, completeWorkout);

router.put("/meal", protect, completeMeal);

module.exports = router;
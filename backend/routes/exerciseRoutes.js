const express = require("express");

const {
  getAllExercises,
  getExerciseById,
  getExercisesByGoal,
  generateTodayWorkout,
  createExercise,
  updateExercise,
  deleteExercise,
  resetTodayWorkout,
} = require("../controllers/exerciseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllExercises);
router.get("/goal/:goal", getExercisesByGoal);
router.get("/today", authMiddleware, generateTodayWorkout);

router.get("/:id", getExerciseById);

// Admin CRUD
router.post("/", createExercise);

// Reset today's workout
router.put("/reset-today", authMiddleware, resetTodayWorkout);

// Update and delete exercise
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
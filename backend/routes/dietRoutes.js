const express = require("express");
const {
  getAllDiets,
  getDietById,
  getDietsByGoal,
  generateTodayDiet,
  createDiet,
  updateDiet,
  deleteDiet,
} = require("../controllers/dietController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to prevent browser GET response caching
const noCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

// Get all diets
router.get("/", getAllDiets);

// Get diets by goal (IMPORTANT: keep this above :id)
router.get("/goal/:goal", getDietsByGoal);

// Generate or get today's diet (no-cache added)
router.get("/today", authMiddleware, noCache, generateTodayDiet);

// Get diet by ID
router.get("/:id", getDietById);

// Admin CRUD
router.post("/", createDiet);
router.put("/:id", updateDiet);
router.delete("/:id", deleteDiet);

module.exports = router;
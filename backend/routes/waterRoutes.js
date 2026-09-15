const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTodayWater,
  addWater,
} = require("../controllers/waterController");

router.get("/", authMiddleware, getTodayWater);

router.post("/add", authMiddleware, addWater);

module.exports = router;
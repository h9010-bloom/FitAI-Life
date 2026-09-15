const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTodaySleep,
  saveSleep,
} = require("../controllers/sleepController");

router.get("/", authMiddleware, getTodaySleep);

router.post("/save", authMiddleware, saveSleep);

module.exports = router;
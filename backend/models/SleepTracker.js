const mongoose = require("mongoose");

const sleepTrackerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    bedTime: {
      type: String,
      default: "",
    },

    wakeTime: {
      type: String,
      default: "",
    },

    sleepHours: {
      type: Number,
      default: 0,
    },

    sleepScore: {
      type: Number,
      default: 0,
    },

    quality: {
      type: String,
      default: "Not Recorded",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SleepTracker",
  sleepTrackerSchema
);
const mongoose = require("mongoose");

const DailyCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Attendance
    attendance: {
      type: Boolean,
      default: false,
    },

    // Exercise
    workoutCompleted: {
      type: Boolean,
      default: false,
    },

    // Meal
    mealCompleted: {
      type: Boolean,
      default: false,
    },

    // Water Goal
    waterCompleted: {
      type: Boolean,
      default: false,
    },

    // Additional Information
    mood: {
      type: String,
      enum: [
        "Excellent",
        "Good",
        "Okay",
        "Tired",
        "Stressed",
      ],
      default: "Good",
    },

    sleepHours: {
      type: Number,
      default: 8,
      min: 0,
      max: 24,
    },

    waterIntake: {
      type: Number,
      default: 0,
    },

    calories: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

DailyCheckInSchema.index(
  {
    userId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("DailyCheckIn", DailyCheckInSchema);
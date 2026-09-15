const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Membership
    membership: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    // Workout Type
    workoutType: {
      type: String,
      enum: ["Warm-up", "Main Workout", "Core", "Cool Down"],
      default: "Main Workout",
    },

    // Sets
    sets: {
      type: Number,
      default: 3,
    },

    // Reps
    reps: {
      type: String,
      default: "10-12",
    },

    // Rest Time
    rest: {
      type: String,
      default: "60 sec",
    },

    // Equipment
    equipment: {
      type: String,
      default: "Body Weight",
    },

    // Trainer Note
    trainerNote: {
      type: String,
      default: "",
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);

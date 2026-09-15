const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    currentWeight: {
      type: Number,
    },
    bmi: {
      type: Number,
    },
    caloriesBurned: {
      type: Number,
    },
    workoutCompleted: {
      type: Boolean,
      default: false,
    },
    waterIntake: {
      type: Number,
    },
    sleepHours: {
      type: Number,
    },
    steps: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Progress', progressSchema);

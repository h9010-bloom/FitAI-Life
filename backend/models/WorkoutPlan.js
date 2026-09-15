const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goal: { type: String },
    age: { type: Number },
    weight: { type: Number },
    fitnessLevel: { type: String },
    workoutName: { type: String },
    plan: { type: mongoose.Schema.Types.Mixed },
    totalDuration: { type: Number },
    caloriesBurned: { type: Number },
    aiRaw: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

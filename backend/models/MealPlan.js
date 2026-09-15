const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: { type: Number },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    goal: { type: String },
    vegetarian: { type: Boolean, default: false },
    plan: {
      type: mongoose.Schema.Types.Mixed, // structured meal plan (breakfast, lunch, dinner, snacks)
    },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    aiRaw: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MealPlan', mealPlanSchema);

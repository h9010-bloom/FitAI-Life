const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    dietName: {
      type: String,
      required: true,
      trim: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      required: true,
    },

    carbs: {
      type: Number,
      required: true,
    },

    fats: {
      type: Number,
      required: true,
    },

    // Meal category
    // Only these 4 types are allowed
    mealType: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      trim: true,
    },

    // Vegetarian / Non-Vegetarian
    vegetarian: {
      type: Boolean,
      default: true,
    },

    // Free or Premium diet
    membership: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    // Fitness goal
    goal: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    // Kept for compatibility with existing records.
    // The frontend determines the correct display time
    // from mealType.
    bestTime: {
      type: String,
      trim: true,
    },

    waterIntake: {
      type: String,
      trim: true,
    },

    dietitianNote: {
      type: String,
      trim: true,
    },

    quantity: {
      type: String,
      trim: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Diet", dietSchema);
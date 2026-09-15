const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
    },

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    goal: {
      type: String,
    },

    vegetarian: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
    },

    // ======================================
    // MEMBERSHIP
    // ======================================

    isPremium: {
      type: Boolean,
      default: false,
    },

    membershipType: {
      type: String,
      enum: ["Free", "Premium Trial", "Premium"],
      default: "Free",
    },

    membershipStatus: {
      type: String,
      default: "Active",
    },

    membershipPrice: {
      type: Number,
      default: 0,
    },

    trialActive: {
      type: Boolean,
      default: false,
    },

    trialStartDate: {
      type: Date,
      default: null,
    },

    trialEndDate: {
      type: Date,
      default: null,
    },

    // ======================================
    // FITNESS CHALLENGE
    // ======================================

    challengePlan: {
      type: String,
      default: "",
    },

    targetDays: {
      type: Number,
      default: 0,
    },

    completedDays: {
      type: Number,
      default: 0,
    },

    challengeStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Active", "Completed", "Failed"],
      default: "Not Started",
    },

    challengeCompletion: {
      type: Number,
      default: 0,
    },

    workoutProgress: {
      type: Number,
      default: 0,
    },

    mealProgress: {
      type: Number,
      default: 0,
    },

    challengeStartDate: {
      type: Date,
      default: null,
    },

    challengeEndDate: {
      type: Date,
      default: null,
    },

    challengeCompletedPopup: {
      type: Boolean,
      default: false,
    },

    premiumPopupShown: {
      type: Boolean,
      default: false,
    },

    lastCompletedChallenge: {
      type: String,
      default: "",
    },

    lastCompletedMembership: {
      type: String,
      default: "",
    },

    challengeHistory: [
      {
        challengeName: String,

        membershipType: String,

        targetDays: Number,

        completedDays: Number,

        startedAt: Date,

        completedAt: Date,

        status: {
          type: String,
          default: "Completed",
        },

        rewardClaimed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ======================================
    // ACHIEVEMENT BADGES
    // ======================================

    badges: [
      {
        type: String,
      },
    ],

    // ======================================
    // WORKOUT
    // ======================================

    dailyStreak: {
      type: Number,
      default: 0,
    },

    lastWorkoutDate: {
      type: Date,
      default: null,
    },

    // Today's generated exercises
    todayExercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],

    workoutCompleted: {
      type: Boolean,
      default: false,
    },

    workoutCompletedToday: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // DIET
    // ======================================

    mealStreak: {
      type: Number,
      default: 0,
    },

    waterGoal: {
      type: Number,
      default: 2500,
    },

    sleepGoal: {
      type: Number,
      default: 8,
    },

    todaySleep: {
      type: Number,
      default: 0,
    },

    todayWater: {
      type: Number,
      default: 0,
    },

    lastMealDate: {
      type: Date,
      default: null,
    },

    // Today's generated meals
    todayMeals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diet",
      },
    ],

    mealCompleted: {
      type: Boolean,
      default: false,
    },

    mealCompletedToday: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // ===============================
    // LIFETIME STATS
    // ===============================

    totalChallengesCompleted: {
      type: Number,
      default: 0,
    },

    totalWorkoutDays: {
      type: Number,
      default: 0,
    },

    totalMealDays: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
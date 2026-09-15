const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ==========================================
// GET USER PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      email,
      age,
      gender,
      height,
      weight,
      goal,
    } = req.body;

    // Check if email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goal !== undefined) user.goal = goal;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};//part 1 done
// ==========================================
// SAVE CHALLENGE HISTORY
// ==========================================

const saveChallengeHistory = (user) => {
  if (!hasMatchingHistory) {
    user.challengeHistory = [
      ...(user.challengeHistory || []),
      historyItem,
    ];

    // ==========================
    // Achievement Badges
    // ==========================

    if (!user.badges) {
      user.badges = [];
    }

    if (!user.badges.includes("🥉 First Challenge")) {
      user.badges.push("🥉 First Challenge");
    }

    if (user.totalChallengesCompleted >= 5 &&
      !user.badges.includes("🥈 Consistency Master")) {
      user.badges.push("🥈 Consistency Master");
    }

    if (user.totalChallengesCompleted >= 10 &&
      !user.badges.includes("🥇 Fitness Champion")) {
      user.badges.push("🥇 Fitness Champion");
    }

    if (
      user.membershipType === "Premium" &&
      !user.badges.includes("👑 Premium Member")
    ) {
      user.badges.push("👑 Premium Member");
    }
  }

  // Lifetime completed challenges
  user.totalChallengesCompleted =
    (user.totalChallengesCompleted || 0) + 1;

  const alreadyExists = user.challengeHistory.some((history) => {
    return (
      history.challengeName === user.challengePlan &&
      new Date(history.startedAt).getTime() ===
      new Date(user.challengeStartDate).getTime()
    );
  });

  if (alreadyExists) {
    return;
  }

  user.challengeHistory.push({
    challengeName: user.challengePlan,
    membershipType: user.membershipType,
    targetDays: user.targetDays,
    completedDays: user.completedDays,
    startedAt: user.challengeStartDate,
    completedAt: new Date(),
    status: "Completed",
  });
};

// ==========================================
// CALCULATE CHALLENGE PERCENTAGE
// ==========================================

const computeChallengeCompletion = (
  completedDays,
  targetDays
) => {

  if (targetDays === 0) {
    return 0;
  }

  let percentage =
    Math.round((completedDays / targetDays) * 100);

  if (percentage > 100) {
    percentage = 100;
  }

  return percentage;
};

// ==========================================
// UPDATE CHALLENGE
// ==========================================

const updateChallengeCompletion = (user) => {

  if (
    !user.workoutCompletedToday ||
    !user.mealCompletedToday
  ) {

    user.challengeCompletion =
      computeChallengeCompletion(
        user.completedDays,
        user.targetDays
      );

    user.workoutProgress =
      user.challengeCompletion;

    user.mealProgress =
      user.challengeCompletion;

    return;
  }

  user.completedDays += 1;

  if (user.completedDays > user.targetDays) {
    user.completedDays = user.targetDays;
  }

  user.challengeCompletion =
    computeChallengeCompletion(
      user.completedDays,
      user.targetDays
    );

  user.workoutProgress =
    user.challengeCompletion;

  user.mealProgress =
    user.challengeCompletion;

  user.workoutCompletedToday = false;
  user.mealCompletedToday = false;

  if (
    user.completedDays >= user.targetDays &&
    user.challengeStatus !== "Completed"
  ) {

    user.challengeStatus = "Completed";

    user.challengeEndDate = new Date();

    user.challengeCompletedPopup = true;

    user.premiumPopupShown = false;

    user.lastCompletedChallenge =
      user.challengePlan;

    user.lastCompletedMembership =
      user.membershipType;

    saveChallengeHistory(user);
  }
};//part 2

// Complete workout and update streak
// ==========================================
// COMPLETE WORKOUT
// ==========================================

// ==========================================
// COMPLETE WORKOUT
// ==========================================

const completeWorkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // Check today's date
    // -------------------------------------------------

    const today = new Date();

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    // -------------------------------------------------
    // Check the date of the previous workout
    // -------------------------------------------------

    let lastWorkoutDay = null;

    if (user.lastWorkoutDate) {
      lastWorkoutDay = new Date(user.lastWorkoutDate);
      lastWorkoutDay.setHours(0, 0, 0, 0);
    }

    // -------------------------------------------------
    // PREVENT DOUBLE COMPLETION ON THE SAME DAY
    // -------------------------------------------------

    if (
      user.workoutCompleted &&
      lastWorkoutDay &&
      lastWorkoutDay.getTime() === todayStart.getTime()
    ) {
      return res.status(200).json({
        message: "Workout already completed today.",
        alreadyCompleted: true,
        streak: user.dailyStreak || 0,
        lastWorkoutDate: user.lastWorkoutDate,
      });
    }

    // -------------------------------------------------
    // CALCULATE CORRECT WORKOUT STREAK
    // -------------------------------------------------

    let newStreak = 1;

    if (lastWorkoutDay) {
      const differenceInMilliseconds =
        todayStart.getTime() - lastWorkoutDay.getTime();

      const differenceInDays =
        Math.round(
          differenceInMilliseconds /
          (1000 * 60 * 60 * 24)
        );

      // Previous workout was exactly yesterday
      if (differenceInDays === 1) {
        newStreak = (user.dailyStreak || 0) + 1;
      }

      // If difference is greater than 1 day,
      // the streak is broken and starts again at 1.
      else {
        newStreak = 1;
      }
    }

    // -------------------------------------------------
    // UPDATE WORKOUT STREAK
    // -------------------------------------------------

    user.dailyStreak = newStreak;

    // Lifetime workout completion count
    user.totalWorkoutDays =
      (user.totalWorkoutDays || 0) + 1;

    // Save today's workout date
    user.lastWorkoutDate = new Date();

    // Mark today's workout as completed
    user.workoutCompleted = true;
    user.workoutCompletedToday = true;

    // Clear today's generated exercises
    user.todayExercises = [];

    // -------------------------------------------------
    // KEEP YOUR EXISTING CHALLENGE LOGIC
    // -------------------------------------------------

    updateChallengeCompletion(user);

    await user.save();

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      message: "Workout completed successfully.",

      alreadyCompleted: false,

      // Correct workout streak
      streak: user.dailyStreak,

      // Send date back to frontend
      lastWorkoutDate: user.lastWorkoutDate,

      completedDays: user.completedDays,

      challengeCompletion:
        user.challengeCompletion,

      challengeStatus:
        user.challengeStatus,

      workoutProgress:
        user.workoutProgress,

      mealProgress:
        user.mealProgress,
    });

  } catch (error) {
    console.error(
      "Complete Workout Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};//part 3 done

// Complete meals and update meal streak
// ==========================================
// COMPLETE MEAL
// ==========================================

const completeMeal = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const today = new Date().toDateString();

    const lastMeal = user.lastMealDate
      ? new Date(user.lastMealDate).toDateString()
      : "";

    // Already completed today
    if (
      user.mealCompleted &&
      lastMeal === today
    ) {
      return res.status(200).json({
        message: "Meals already completed today.",
        alreadyCompleted: true,
        streak: user.mealStreak,
      });
    }

    // Increase meal streak
    user.mealStreak = (user.mealStreak || 0) + 1;

    // Lifetime meal count
    user.totalMealDays =
      (user.totalMealDays || 0) + 1;

    // Save today's date
    user.lastMealDate = new Date();

    // Mark meal as completed
    user.mealCompleted = true;
    user.mealCompletedToday = true;

    // Clear today's generated meals
    user.todayMeals = [];

    // Update challenge progress
    updateChallengeCompletion(user);

    await user.save();

    res.status(200).json({
      message: "Meals completed successfully.",
      alreadyCompleted: false,

      streak: user.mealStreak,

      completedDays: user.completedDays,

      challengeCompletion: user.challengeCompletion,

      challengeStatus: user.challengeStatus,

      workoutProgress: user.workoutProgress,

      mealProgress: user.mealProgress,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};//part 4 done

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    // Save new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// ===============================
// POPUP MANAGEMENT
// ===============================

// ==========================================
// CLOSE CHALLENGE POPUP
// ==========================================

const closeChallengePopup = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.challengeCompletedPopup = false;

    await user.save();

    res.status(200).json({
      message: "Challenge popup closed.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};


// ==========================================
// CLOSE PREMIUM POPUP
// ==========================================

const closePremiumPopup = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.premiumPopupShown = true;

    await user.save();

    res.status(200).json({
      message: "Premium popup closed.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

module.exports = {
  getProfile,
  updateProfile,

  completeWorkout,
  completeMeal,

  changePassword,

  closeChallengePopup,
  closePremiumPopup,
};
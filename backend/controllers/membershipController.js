const User = require('../models/User');

// ======================================
// GET TARGET DAYS
// ======================================

const getTargetDays = (challengePlan) => {
  switch (challengePlan) {
    case "2 Weeks":
      return 14;

    case "5 Weeks":
      return 35;

    case "8 Weeks":
      return 56;

    case "1 Month":
      return 30;

    case "2 Months":
      return 60;

    case "4 Months":
      return 120;

    case "6 Months":
      return 180;

    case "1 Year":
      return 365;

    default:
      return 0;
  }
};

const resetChallengeData = (user, challengePlan) => {

  // Save previous completed challenge
  if (
    user.challengeStatus === "Completed" &&
    user.challengePlan &&
    user.completedDays > 0
  ) {
    user.challengeHistory.push({
      challengeName: user.challengePlan,
      membershipType: user.membershipType,
      targetDays: user.targetDays,
      completedDays: user.completedDays,
      startedAt: user.challengeStartDate,
      completedAt: user.challengeEndDate,
      status: "Completed",
      rewardClaimed: false,
    });
  }

  // ===========================
  // New Challenge
  // ===========================

  user.challengePlan = challengePlan;
  user.targetDays = getTargetDays(challengePlan);

  user.completedDays = 0;
  user.challengeCompletion = 0;

  user.workoutProgress = 0;
  user.mealProgress = 0;

  user.challengeStatus = "In Progress";

  user.challengeStartDate = new Date();
  user.challengeEndDate = null;

  // ===========================
  // Daily Challenge Reset
  // ===========================

  user.workoutCompleted = false;
  user.mealCompleted = false;

  user.workoutCompletedToday = false;
  user.mealCompletedToday = false;

  user.todayExercises = [];
  user.todayMeals = [];

  // ===========================
  // Reset Challenge Streak
  // ===========================

  user.dailyStreak = 0;
  user.mealStreak = 0;

  console.log("===== RESET CHALLENGE =====");
  console.log("dailyStreak:", user.dailyStreak);
  console.log("mealStreak:", user.mealStreak);

  user.lastWorkoutDate = null;
  user.lastMealDate = null;

  // ===========================
  // Reset Popups
  // ===========================

  user.challengeCompletedPopup = false;
  user.premiumPopupShown = false;

  user.lastCompletedChallenge = "";
  user.lastCompletedMembership = "";
};

const saveMembership = async (req, res) => {
  try {

    const { membershipType, challengePlan } = req.body;

    if (!membershipType || !challengePlan) {
      return res.status(400).json({
        message: "Membership type and challenge plan are required.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ===========================
    // Reset challenge
    // ===========================

    resetChallengeData(user, challengePlan);

    // ===========================
    // Membership
    // ===========================

    if (membershipType === "Free") {

      user.membershipType = "Free";
      user.membershipStatus = "Active";

      user.isPremium = false;

      user.trialActive = false;
      user.trialStartDate = null;
      user.trialEndDate = null;

      user.membershipPrice = 0;

    }

    else if (membershipType === "Premium Trial") {

      const today = new Date();

      const trialEnd = new Date(today);
      trialEnd.setDate(today.getDate() + 7);

      user.membershipType = "Premium Trial";
      user.membershipStatus = "Trial";

      user.isPremium = true;

      user.trialActive = true;
      user.trialStartDate = today;
      user.trialEndDate = trialEnd;

      user.membershipPrice = 0;

    }

    else if (membershipType === "Premium") {

      user.membershipType = "Premium";
      user.membershipStatus = "Active";

      user.isPremium = true;

      user.trialActive = false;
      user.trialStartDate = null;
      user.trialEndDate = null;

      user.membershipPrice = 599;

    }

    else {

      return res.status(400).json({
        message: "Invalid membership type.",
      });

    }

    console.log("===== BEFORE SAVE =====");
    console.log("dailyStreak:", user.dailyStreak);
    console.log("mealStreak:", user.mealStreak);

    await user.save();

    console.log("===== AFTER SAVE =====");
    console.log("dailyStreak:", user.dailyStreak);
    console.log("mealStreak:", user.mealStreak);

    res.status(200).json({
      message: "Membership saved successfully.",
      user,
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const getMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'membershipType challengePlan trialActive trialStartDate trialEndDate membershipStatus challengeStatus targetDays completedDays challengeCompletion challengeStartDate challengeEndDate'
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      membershipType: user.membershipType,
      challengePlan: user.challengePlan,
      trialActive: user.trialActive,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      membershipStatus: user.membershipStatus,
      challengeStatus: user.challengeStatus,
      targetDays: user.targetDays,
      completedDays: user.completedDays,
      challengeCompletion: user.challengeCompletion,
      challengeStartDate: user.challengeStartDate,
      challengeEndDate: user.challengeEndDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const checkTrial = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (
      user.trialActive === true &&
      user.trialEndDate &&
      new Date() > new Date(user.trialEndDate)
    ) {
      user.membershipType = 'Free';
      user.isPremium = false;
      user.trialActive = false;
      user.membershipStatus = 'Expired';
      user.trialStartDate = null;
      user.trialEndDate = null;

      await user.save();
    }

    res.status(200).json({
      membershipType: user.membershipType,
      challengePlan: user.challengePlan,
      trialActive: user.trialActive,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      membershipStatus: user.membershipStatus,
      challengeStatus: user.challengeStatus,
      targetDays: user.targetDays,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  saveMembership,
  getMembership,
  checkTrial,
};

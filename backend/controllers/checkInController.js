const DailyCheckIn = require("../models/DailyCheckIn");
const User = require("../models/User");

// ===============================
// Helper Functions
// ===============================

const getDayKey = (date) => {
  const currentDate = new Date(date);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfDay = (date) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  return current;
};

// Reset today's temporary completion flags
const resetDailyFlags = async (user) => {
  if (!user) return;

  const today = new Date().toDateString();

  if (
    user.lastWorkoutDate &&
    new Date(user.lastWorkoutDate).toDateString() !== today
  ) {
    user.workoutCompletedToday = false;
  }

  if (
    user.lastMealDate &&
    new Date(user.lastMealDate).toDateString() !== today
  ) {
    user.mealCompletedToday = false;
  }

  await user.save();
};

// ===============================
// Daily Check-In Helpers
// ===============================

const getTodayRecord = async (userId) => {
  const startOfDay = getStartOfDay(new Date());

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return DailyCheckIn.findOne({
    userId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });
};

const ensureTodayRecord = async (userId) => {
  let record = await getTodayRecord(userId);

  if (!record) {
    record = await DailyCheckIn.create({
      userId,
      date: getStartOfDay(new Date()),
    });
  }

  return record;
};

const hasAnyCompletion = (record) =>
  Boolean(
    record &&
      (
        record.attendance ||
        record.workoutCompleted ||
        record.mealCompleted ||
        record.waterCompleted
      )
  );
  // ===============================
// GET TODAY CHECK-IN
// ===============================

const getTodayCheckIn = async (req, res) => {
  try {
    const record = await ensureTodayRecord(req.user.id);

    const today = new Date();

    const streak = await calculateStreak(req.user.id, today);

    res.status(200).json({
      record,
      streak,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};

// ===============================
// CALCULATE STREAK
// ===============================

const calculateStreak = async (userId, today) => {

  const todayRecord = await getTodayRecord(userId);

  if (!hasAnyCompletion(todayRecord)) {
    return 0;
  }

  let streak = 1;

  let cursor = new Date(today);

  cursor.setDate(cursor.getDate() - 1);

  while (true) {

    const startOfDay = getStartOfDay(cursor);

    const endOfDay = new Date(startOfDay);

    endOfDay.setDate(endOfDay.getDate() + 1);

    const previousRecord = await DailyCheckIn.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!previousRecord || !hasAnyCompletion(previousRecord)) {
      break;
    }

    streak++;

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};
// ===============================
// MARK ATTENDANCE
// ===============================

const markPresent = async (req, res) => {
  try {

    const record = await ensureTodayRecord(req.user.id);

    if (record.attendance) {
      return res.status(200).json({
        message: "Attendance already marked",
        record,
      });
    }

    record.attendance = true;

    await record.save();

    const streak = await calculateStreak(req.user.id, new Date());

    res.status(200).json({
      message: "Attendance marked successfully",
      record,
      streak,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};
// ===============================
// COMPLETE WORKOUT
// ===============================

const completeWorkout = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await resetDailyFlags(user);

    if (user.challengeStatus === "Completed") {
      return res.status(200).json({
        message: "Challenge already completed.",
      });
    }

    const record = await ensureTodayRecord(req.user.id);

    if (record.workoutCompleted) {
      return res.status(200).json({
        message: "Workout already completed today.",
        record,
      });
    }

    // Update today's check-in
    record.workoutCompleted = true;
    await record.save();

    // Update user challenge
    user.workoutCompletedToday = true;
    user.lastWorkoutDate = new Date();

    // Only complete a challenge day when BOTH workout & meal are done
    if (user.workoutCompletedToday && user.mealCompletedToday) {

      user.completedDays = Math.min(
        user.completedDays + 1,
        user.targetDays
      );

      user.challengeCompletion = Math.round(
        (user.completedDays / user.targetDays) * 100
      );

      user.workoutProgress = user.challengeCompletion;
      user.mealProgress = user.challengeCompletion;

      // Reset daily flags for tomorrow
      user.workoutCompletedToday = false;
      user.mealCompletedToday = false;

      // Challenge finished
      if (user.completedDays >= user.targetDays) {

        user.challengeStatus = "Completed";
        user.challengeCompletion = 100;
        user.challengeEndDate = new Date();

        user.lastCompletedChallenge = user.challengePlan;
        user.lastCompletedMembership = user.membershipType;

        user.challengeCompletedPopup = true;
        user.premiumPopupShown = false;
      }
    }

    await user.save();

    res.status(200).json({
      message: "Workout completed successfully.",
      record,
      completedDays: user.completedDays,
      challengeCompletion: user.challengeCompletion,
      challengeStatus: user.challengeStatus,
      workoutProgress: user.workoutProgress,
      mealProgress: user.mealProgress,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};
// ===============================
// COMPLETE MEAL
// ===============================

const completeMeal = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await resetDailyFlags(user);

    if (user.challengeStatus === "Completed") {
      return res.status(200).json({
        message: "Challenge already completed.",
      });
    }

    const record = await ensureTodayRecord(req.user.id);

    if (record.mealCompleted) {
      return res.status(200).json({
        message: "Meal already completed today.",
        record,
      });
    }

    // Update today's check-in
    record.mealCompleted = true;
    await record.save();

    // Update user meal status
    user.mealCompletedToday = true;
    user.lastMealDate = new Date();

    // Challenge day is completed only when BOTH workout & meal are completed
    if (user.workoutCompletedToday && user.mealCompletedToday) {

      user.completedDays = Math.min(
        user.completedDays + 1,
        user.targetDays
      );

      user.challengeCompletion = Math.round(
        (user.completedDays / user.targetDays) * 100
      );

      user.workoutProgress = user.challengeCompletion;
      user.mealProgress = user.challengeCompletion;

      // Reset daily flags for tomorrow
      user.workoutCompletedToday = false;
      user.mealCompletedToday = false;

      // Challenge completed
      if (user.completedDays >= user.targetDays) {

        user.challengeStatus = "Completed";
        user.challengeCompletion = 100;
        user.challengeEndDate = new Date();

        user.lastCompletedChallenge = user.challengePlan;
        user.lastCompletedMembership = user.membershipType;

        user.challengeCompletedPopup = true;
        user.premiumPopupShown = false;

        // Save challenge history
        user.challengeHistory.push({
          challengeName: user.challengePlan,
          membershipType: user.membershipType,
          targetDays: user.targetDays,
          completedDays: user.completedDays,
          startedAt: user.challengeStartDate,
          completedAt: new Date(),
          status: "Completed",
        });
      }
    }

    await user.save();

    res.status(200).json({
      message: "Meal completed successfully.",
      record,
      completedDays: user.completedDays,
      challengeCompletion: user.challengeCompletion,
      challengeStatus: user.challengeStatus,
      workoutProgress: user.workoutProgress,
      mealProgress: user.mealProgress,
      showChallengeCompletedPopup: user.challengeCompletedPopup,
      showPremiumUpgradePopup:
        user.challengeCompletedPopup &&
        !user.premiumPopupShown &&
        user.membershipType === "Free",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};
// ===============================
// ADMIN - GET ALL CHECK-INS
// ===============================

const getAllCheckIns = async (req, res) => {
  try {

    const checkIns = await DailyCheckIn.find()
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.status(200).json(checkIns);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};

module.exports = {
  getTodayCheckIn,
  getAllCheckIns,
  markPresent,
  completeWorkout,
  completeMeal,
};
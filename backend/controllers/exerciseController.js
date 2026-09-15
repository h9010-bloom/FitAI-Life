const Exercise = require('../models/Exercise');
const User = require('../models/User');

const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getExercisesByGoal = async (req, res) => {
  try {
    const exercises = await Exercise.find({ goal: req.params.goal }).sort({ createdAt: -1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate Today's Workout
const generateTodayWorkout = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).populate("todayExercises");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Today's date
    const today = new Date().toDateString();

    // Last workout date
    const lastDate = user.lastWorkoutDate
      ? new Date(user.lastWorkoutDate).toDateString()
      : "";

    // New day starts
    if (today !== lastDate) {
      user.todayExercises = [];
      user.workoutCompleted = false;
      await user.save();
    }

    // Already completed today
    if (user.workoutCompleted) {
      return res.json({
        completed: true,
        message:
          "Workout already completed today. Come back tomorrow.",
      });
    }

    // Already generated today
    // Check whether today's saved exercises match the user's membership
    if (user.todayExercises.length > 0) {

      const savedExercises = user.todayExercises;

      const membership = String(user.membershipType || "")
        .trim()
        .toLowerCase();

      const isPremium =
        membership === "premium" ||
        membership === "premium trial";

      const expectedMembership = isPremium ? "Premium" : "Free";

      const validExercises = savedExercises.filter(
        (exercise) =>
          exercise &&
          (
            exercise.membership === expectedMembership ||
            (!exercise.membership && expectedMembership === "Free")
          )
      );

      // If saved exercises belong to the correct membership,
      // show them again today.
      if (validExercises.length > 0) {

        return res.json({
          completed: false,
          exercises: validExercises,
        });

      }

      // Saved exercises belong to another membership.
      // Clear them and generate the correct workout.
      user.todayExercises = [];
      user.workoutCompleted = false;

      await user.save();
    }

    // Get exercises according to goal
    // ======================================
    // FREE WORKOUT
    // ======================================

    console.log("========== WORKOUT DEBUG ==========");
    console.log("User ID:", user._id);
    console.log("User Goal:", user.goal);
    console.log("User Membership:", user.membershipType);
    console.log("==================================");

    // Get exercises according to user's goal and membership

    // Get exercises according to goal and membership

    let exercises;

    // Normalize user's goal
    // Normalize user's goal
    const userGoal = String(user.goal || "")
      .trim()
      .toLowerCase();

    let goalOptions = [];

    if (
      userGoal === "lose weight" ||
      userGoal === "weight loss"
    ) {
      goalOptions = [
        "Lose Weight",
        "Weight Loss",
      ];
    } else if (
      userGoal === "Weight Gain" ||
      userGoal === "gain weight" ||
      userGoal === "gain muscle"
    ) {
      goalOptions = [
        "Weight Gain",
        "Gain Weight",
        "Gain Muscle",
      ];
    } else if (
      userGoal === "stay fit" ||
      userGoal === "fitness"
    ) {
      goalOptions = [
        "Stay Fit",
        "Fitness",
      ];
    } else {
      goalOptions = [user.goal];
    }

    console.log("Goal searched:", goalOptions);

    // Normalize membership
    const membership = String(user.membershipType || "")
      .trim()
      .toLowerCase();

    const isPremium =
      membership === "premium" ||
      membership === "premium trial";

    // FREE USER
    if (!isPremium) {

      exercises = await Exercise.find({
        goal: { $in: goalOptions },
        membership: "free"
      });

    } else {

      exercises = await Exercise.find({
        goal: { $in: goalOptions },
        membership: "Premium"
      });

    }

    if (!exercises || exercises.length === 0) {
      return res.json({
        completed: false,
        exercises: [],
        message: "No exercises found for your goal.",
      });
    }

    // Shuffle
    const shuffled = [...exercises];

    for (
      let i = shuffled.length - 1;
      i > 0;
      i--
    ) {

      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [shuffled[i], shuffled[j]] = [
        shuffled[j],
        shuffled[i],
      ];
    }

    // Select 4
    const selected = shuffled.slice(
      0,
      Math.min(4, shuffled.length)
    );

    // Save today's workout
    user.todayExercises = selected.map(
      (item) => item._id
    );

    await user.save();

    return res.json({
      completed: false,
      exercises: selected,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const createExercise = async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    const savedExercise = await exercise.save();

    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateExercise = async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetTodayWorkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.todayExercises = [];
    user.workoutCompleted = false;

    await user.save();

    res.json({
      message: "Today's workout reset successfully."
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllExercises,
  getExerciseById,
  getExercisesByGoal,
  generateTodayWorkout,
  createExercise,
  updateExercise,
  deleteExercise,
  resetTodayWorkout
};

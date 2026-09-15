const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Diet = require("../models/Diet");
const WorkoutPlan = require("../models/WorkoutPlan");

// ===============================
// USERS
// ===============================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

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

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// EXERCISES
// ===============================

const getAllExercisesAdmin = async (req, res) => {
  try {

    const exercises = await Exercise.find().sort({
      createdAt: -1,
    });

    res.status(200).json(exercises);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const createExerciseAdmin = async (req, res) => {
  try {

    const exercise = new Exercise(req.body);

    const savedExercise = await exercise.save();

    res.status(201).json(savedExercise);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const updateExerciseAdmin = async (req, res) => {
  try {

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json(updatedExercise);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const deleteExerciseAdmin = async (req, res) => {
  try {

    const deletedExercise =
      await Exercise.findByIdAndDelete(req.params.id);

    if (!deletedExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      message: "Exercise deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// ===============================
// DIETS
// ===============================

const getAllDietsAdmin = async (req, res) => {
  try {

    const diets = await Diet.find().sort({
      createdAt: -1,
    });

    res.status(200).json(diets);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const createDietAdmin = async (req, res) => {
  try {

    const diet = new Diet(req.body);

    const savedDiet = await diet.save();

    res.status(201).json(savedDiet);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const updateDietAdmin = async (req, res) => {
  try {

    const updatedDiet = await Diet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDiet) {
      return res.status(404).json({
        message: "Diet not found",
      });
    }

    res.status(200).json(updatedDiet);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const deleteDietAdmin = async (req, res) => {
  try {

    const deletedDiet =
      await Diet.findByIdAndDelete(req.params.id);

    if (!deletedDiet) {
      return res.status(404).json({
        message: "Diet not found",
      });
    }

    res.status(200).json({
      message: "Diet deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// ===============================
// WORKOUTS
// ===============================

const getAllWorkoutsAdmin = async (req, res) => {
  try {

    const workouts = await WorkoutPlan.find().sort({
      createdAt: -1,
    });

    res.status(200).json(workouts);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

const deleteWorkoutAdmin = async (req, res) => {
  try {

    const deletedWorkout =
      await WorkoutPlan.findByIdAndDelete(req.params.id);

    if (!deletedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// ===============================
// CHECK-IN MANAGEMENT (NEW)
// ===============================

const getAllCheckInsAdmin = async (req, res) => {
  try {

    const users = await User.find({})
      .select(
        "name email goal dailyStreak mealStreak lastWorkoutDate lastMealDate createdAt"
      )
      .sort({ createdAt: -1 });

    console.log("CHECKINS:", users);

    res.status(200).json(users);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// DASHBOARD
// ===============================

const getDashboardStats = async (req, res) => {
  try {

    const usersCount = await User.countDocuments();
    const exercisesCount = await Exercise.countDocuments();
    const dietsCount = await Diet.countDocuments();
    const workoutsCount = await WorkoutPlan.countDocuments();

    res.status(200).json({
      usersCount,
      exercisesCount,
      dietsCount,
      workoutsCount,
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
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,

  getAllExercisesAdmin,
  createExerciseAdmin,
  updateExerciseAdmin,
  deleteExerciseAdmin,

  getAllDietsAdmin,
  createDietAdmin,
  updateDietAdmin,
  deleteDietAdmin,

  getAllWorkoutsAdmin,
  deleteWorkoutAdmin,

  // NEW
  getAllCheckInsAdmin,

  getDashboardStats,
};
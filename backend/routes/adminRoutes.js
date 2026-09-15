const express = require("express");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const admin = require("../controllers/adminController");

const router = express.Router();


// =====================================
// USERS
// =====================================

router.get(
  "/users",
  protect,
  isAdmin,
  admin.getAllUsers
);

router.get(
  "/users/:id",
  protect,
  isAdmin,
  admin.getUserById
);

router.put(
  "/users/:id",
  protect,
  isAdmin,
  admin.updateUserRole
);

router.delete(
  "/users/:id",
  protect,
  isAdmin,
  admin.deleteUser
);


// =====================================
// EXERCISES
// =====================================

router.get(
  "/exercises",
  protect,
  isAdmin,
  admin.getAllExercisesAdmin
);

router.post(
  "/exercises",
  protect,
  isAdmin,
  admin.createExerciseAdmin
);

router.put(
  "/exercises/:id",
  protect,
  isAdmin,
  admin.updateExerciseAdmin
);

router.delete(
  "/exercises/:id",
  protect,
  isAdmin,
  admin.deleteExerciseAdmin
);


// =====================================
// DIETS
// =====================================

router.get(
  "/diets",
  protect,
  isAdmin,
  admin.getAllDietsAdmin
);

router.post(
  "/diets",
  protect,
  isAdmin,
  admin.createDietAdmin
);

router.put(
  "/diets/:id",
  protect,
  isAdmin,
  admin.updateDietAdmin
);

router.delete(
  "/diets/:id",
  protect,
  isAdmin,
  admin.deleteDietAdmin
);


// =====================================
// WORKOUT PLANS
// =====================================

router.get(
  "/workouts",
  protect,
  isAdmin,
  admin.getAllWorkoutsAdmin
);

router.delete(
  "/workouts/:id",
  protect,
  isAdmin,
  admin.deleteWorkoutAdmin
);


// =====================================
// CHECK-IN MANAGEMENT (NEW)
// =====================================

router.get(
  "/checkins",
  admin.getAllCheckInsAdmin
);

// =====================================
// DASHBOARD
// =====================================

router.get(
  "/dashboard",
  protect,
  isAdmin,
  admin.getDashboardStats
);

module.exports = router;
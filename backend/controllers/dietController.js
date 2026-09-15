const User = require("../models/User");
const Diet = require("../models/Diet");

// =====================================================
// GET ALL DIETS
// =====================================================

const getAllDiets = async (req, res) => {
  try {
    const diets = await Diet.find().sort({ createdAt: -1 });

    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// GET DIET BY ID
// =====================================================

const getDietById = async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);

    if (!diet) {
      return res.status(404).json({
        message: "Diet not found",
      });
    }

    res.status(200).json(diet);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// GET DIETS BY GOAL
// =====================================================

const getDietsByGoal = async (req, res) => {
  try {
    const diets = await Diet.find({
      goal: req.params.goal,
    }).sort({ createdAt: -1 });

    res.status(200).json(diets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// HELPER - NORMALIZE MEAL TYPE
// =====================================================

const normalizeMealType = (type) => {
  if (!type) return "";
  return String(type).trim().toLowerCase();
};


// =====================================================
// HELPER - SHUFFLE ARRAY
// =====================================================

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
};


// =====================================================
// GENERATE TODAY'S DIET
// =====================================================

// =====================================================
// GENERATE TODAY'S DIET
// =====================================================

const generateTodayDiet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("todayMeals");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =====================================================
    // DAILY RESET
    // If the diet was completed on a previous day,
    // allow the user to generate a new diet today.
    // =====================================================

    if (user.mealCompleted && user.lastMealDate) {
      const lastCompletedDate = new Date(user.lastMealDate);
      const today = new Date();

      const lastDateString = lastCompletedDate.toDateString();
      const todayDateString = today.toDateString();

      // Previous day -> reset today's completion status
      if (lastDateString !== todayDateString) {
        user.mealCompleted = false;
        user.todayMeals = [];

        await user.save();
      }
    }

    // =====================================================
    // BLOCK ONLY IF COMPLETED TODAY
    // =====================================================

    if (user.mealCompleted) {
      return res.json({
        completed: true,
        message:
          "Today's diet has already been completed. Come back tomorrow for a fresh diet recommendation.",
      });
    }

    // =====================================================
    // MEMBERSHIP
    // =====================================================

    const membership = String(
      user.membershipType || ""
    )
      .trim()
      .toLowerCase();

    const isPremium =
      membership === "premium" ||
      membership === "premium trial";

    // =====================================================
    // GOAL
    // =====================================================

    let goalOptions = [];

    if (
      user.goal === "Lose Weight" ||
      user.goal === "Weight Loss"
    ) {
      goalOptions = [
        "Lose Weight",
        "Weight Loss",
      ];
    } else if (
      user.goal === "Gain Weight" ||
      user.goal === "Weight Gain"
    ) {
      goalOptions = [
        "Gain Weight",
        "Weight Gain",
      ];
    } else if (
      user.goal === "Maintain Fitness" ||
      user.goal === "Stay Fit"
    ) {
      goalOptions = [
        "Maintain Fitness",
        "Stay Fit",
      ];
    } else {
      goalOptions = [user.goal];
    }

    // =====================================================
    // FETCH MATCHING DIETS
    // =====================================================

    let diets = [];

    if (!isPremium) {
      diets = await Diet.find({
        goal: {
          $in: goalOptions,
        },

        vegetarian: user.vegetarian,

        $or: [
          { membership: "Free" },
          { membership: "free" },
          { membership: "FREE" },
          { membership: { $exists: false } },
        ],
      });
    } else {
      diets = await Diet.find({
        goal: {
          $in: goalOptions,
        },

        membership: "Premium",

        vegetarian: user.vegetarian,
      });
    }

    // =====================================================
    // NO DIETS FOUND
    // =====================================================

    if (!diets || diets.length === 0) {
      return res.status(404).json({
        message:
          "No diet plans available for your goal, membership, and food preference.",
      });
    }

    // =====================================================
    // REQUIRED MEAL TYPES
    // =====================================================

    const mealTypes = [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Snack",
    ];

    const currentMealIds = new Set(
      (user.todayMeals || [])
        .filter(Boolean)
        .map((meal) => meal._id.toString())
    );

    const selected = [];

    // =====================================================
    // SELECT ONE MEAL FROM EACH CATEGORY
    // =====================================================

    for (const type of mealTypes) {
      const matchingMeals = diets.filter(
        (meal) =>
          normalizeMealType(meal.mealType) ===
          normalizeMealType(type)
      );

      if (matchingMeals.length === 0) {
        return res.status(404).json({
          message: `Incomplete plan: No ${type} available for your settings.`,
        });
      }

      // Avoid showing the currently selected meal again
      const unusedMeals = matchingMeals.filter(
        (meal) =>
          !currentMealIds.has(
            meal._id.toString()
          )
      );

      const pool =
        unusedMeals.length > 0
          ? unusedMeals
          : matchingMeals;

      const shuffledPool =
        shuffleArray(pool);

      selected.push(shuffledPool[0]);
    }

    // =====================================================
    // SAVE TODAY'S GENERATED MEALS
    // =====================================================

    user.todayMeals = selected.map(
      (meal) => meal._id
    );

    // IMPORTANT:
    // DO NOT update lastMealDate here.
    //
    // lastMealDate should represent the date
    // when the user COMPLETED the diet,
    // not when they generated it.

    await user.save();

    // =====================================================
    // SEND RESPONSE
    // =====================================================

    return res.json({
      completed: false,
      diets: selected,
    });

  } catch (error) {
    console.error(
      "Generate Diet Error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// CREATE DIET
// =====================================================

const createDiet = async (req, res) => {
  try {
    const diet = new Diet(req.body);

    const savedDiet = await diet.save();

    res.status(201).json(savedDiet);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE DIET
// =====================================================

const updateDiet = async (req, res) => {
  try {
    const updatedDiet =
      // ✅ USE THIS INSTEAD:
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            todayMeals: selected.map((meal) => meal._id),
            lastMealDate: new Date(),
          },
        },
        { new: true }
      );

    if (!updatedDiet) {
      return res.status(404).json({
        message: "Diet not found",
      });
    }

    res.status(200).json(updatedDiet);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE DIET
// =====================================================

const deleteDiet = async (req, res) => {
  try {
    const deletedDiet =
      await Diet.findByIdAndDelete(
        req.params.id
      );

    if (!deletedDiet) {
      return res.status(404).json({
        message: "Diet not found",
      });
    }

    res.status(200).json({
      message: "Diet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllDiets,
  getDietById,
  getDietsByGoal,
  generateTodayDiet,
  createDiet,
  updateDiet,
  deleteDiet,
};
const MealPlan = require('../models/MealPlan');
const geminiService = require('../utils/geminiService');

const generateMealPlan = async (req, res) => {
  try {
    const { age, gender, height, weight, goal, vegetarian } = req.body;

    if (!age || !gender || !height || !weight || !goal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Build a clear JSON-output prompt for the Gemini model
    const prompt = `Generate a daily meal plan in JSON for the following user:\n` +
      `age: ${age}, gender: ${gender}, height: ${height}, weight: ${weight}, goal: ${goal}, vegetarian: ${!!vegetarian}.\n` +
      `Return a JSON object with keys: breakfast, lunch, dinner, snacks (each an array of items), and totals: calories, protein, carbs, fats. ` +
      `Also include a short note field. Ensure the output is valid JSON only.`;

    const aiResponse = await geminiService.generateResponse(prompt);

    // Try to parse JSON from the AI response
    let parsed = null;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      // Attempt to extract JSON substring if AI included extra text
      const start = aiResponse.indexOf('{');
      const end = aiResponse.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        try {
          parsed = JSON.parse(aiResponse.slice(start, end + 1));
        } catch (err) {
          parsed = null;
        }
      }
    }

    const mealPlanData = {
      user: req.user.id,
      age,
      gender,
      height,
      weight,
      goal,
      vegetarian: !!vegetarian,
      plan: parsed || { text: aiResponse },
      aiRaw: aiResponse,
    };

    if (parsed && parsed.totals) {
      mealPlanData.calories = parsed.totals.calories;
      mealPlanData.protein = parsed.totals.protein;
      mealPlanData.carbs = parsed.totals.carbs;
      mealPlanData.fats = parsed.totals.fats;
    }

    const saved = await new MealPlan(mealPlanData).save();

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Meal plan not found' });

    if (plan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this meal plan' });
    }

    await plan.remove();
    res.status(200).json({ message: 'Meal plan deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateMealPlan,
  getMealPlans,
  deleteMealPlan,
};

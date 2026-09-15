const WorkoutPlan = require('../models/WorkoutPlan');
const geminiService = require('../utils/geminiService');

const generateWorkout = async (req, res) => {
  try {
    const { goal, age, weight, fitnessLevel } = req.body;

    if (!goal || !age || !weight || !fitnessLevel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = `Create a workout plan as JSON for a user with goal: ${goal}, age: ${age}, weight: ${weight}, fitnessLevel: ${fitnessLevel}. ` +
      `Return a JSON object with keys: workoutName (string), exercises (array of {name, sets, reps, durationMinutes, caloriesBurned}), totalDuration (minutes), caloriesBurned (total), and a short note. Ensure output is valid JSON only.`;

    const aiResponse = await geminiService.generateResponse(prompt);

    let parsed = null;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
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

    const data = {
      user: req.user.id,
      goal,
      age,
      weight,
      fitnessLevel,
      workoutName: parsed && parsed.workoutName ? parsed.workoutName : (parsed && parsed.name ? parsed.name : 'AI Generated Workout'),
      plan: parsed || { text: aiResponse },
      totalDuration: parsed && parsed.totalDuration ? parsed.totalDuration : (parsed && parsed.exercises ? parsed.exercises.reduce((s, ex) => s + (ex.durationMinutes || 0), 0) : undefined),
      caloriesBurned: parsed && parsed.caloriesBurned ? parsed.caloriesBurned : undefined,
      aiRaw: aiResponse,
    };

    const saved = await new WorkoutPlan(data).save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Workout plan not found' });

    if (plan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this workout plan' });
    }

    await plan.remove();
    res.status(200).json({ message: 'Workout plan deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateWorkout,
  getWorkoutPlans,
  deleteWorkoutPlan,
};

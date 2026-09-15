const Progress = require('../models/Progress');

const addProgress = async (req, res) => {
  try {
    const { currentWeight, bmi, caloriesBurned, workoutCompleted, waterIntake, sleepHours, steps, date } = req.body;

    const progress = new Progress({
      user: req.user.id,
      currentWeight,
      bmi,
      caloriesBurned,
      workoutCompleted,
      waterIntake,
      sleepHours,
      steps,
      date,
    });

    const saved = await progress.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const prog = await Progress.findById(req.params.id);
    if (!prog) return res.status(404).json({ message: 'Progress entry not found' });

    if (prog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this entry' });
    }

    const updated = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const prog = await Progress.findById(req.params.id);
    if (!prog) return res.status(404).json({ message: 'Progress entry not found' });

    if (prog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this entry' });
    }

    await prog.remove();
    res.status(200).json({ message: 'Progress entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addProgress,
  getUserProgress,
  updateProgress,
  deleteProgress,
};

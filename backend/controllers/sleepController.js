const SleepTracker = require("../models/SleepTracker");

// Get Today's Sleep
const getTodaySleep = async (req, res) => {
  try {

    const today = new Date().toDateString();

    let sleep = await SleepTracker.findOne({
      user: req.user.id,
      date: today,
    });

    if (!sleep) {
      sleep = await SleepTracker.create({
        user: req.user.id,
        date: today,
      });
    }

    res.json(sleep);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Save Sleep
const saveSleep = async (req, res) => {

  try {

    const { bedTime, wakeTime } = req.body;

    const today = new Date().toDateString();

    let sleep = await SleepTracker.findOne({
      user: req.user.id,
      date: today,
    });

    if (!sleep) {
      sleep = await SleepTracker.create({
        user: req.user.id,
        date: today,
      });
    }

    // Convert time to Date objects
    const bed = new Date(`1970-01-01T${bedTime}:00`);
    let wake = new Date(`1970-01-01T${wakeTime}:00`);

    // Handle overnight sleep
    if (wake <= bed) {
      wake.setDate(wake.getDate() + 1);
    }

    // Calculate hours
    const hours =
      (wake - bed) / (1000 * 60 * 60);

    sleep.bedTime = bedTime;
    sleep.wakeTime = wakeTime;
    sleep.sleepHours = Number(hours.toFixed(1));

    // Sleep Quality
    if (hours < 6) {
      sleep.quality = "Poor";
      sleep.sleepScore = 50;
    } else if (hours < 8) {
      sleep.quality = "Good";
      sleep.sleepScore = 80;
    } else {
      sleep.quality = "Excellent";
      sleep.sleepScore = 100;
    }

    await sleep.save();

    res.json(sleep);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getTodaySleep,
  saveSleep,
};
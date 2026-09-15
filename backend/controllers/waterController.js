const WaterTracker = require("../models/WaterTracker");

// Get Today's Water
const getTodayWater = async (req, res) => {
    try {
        const today = new Date().toDateString();

        let water = await WaterTracker.findOne({
            user: req.user.id,
            date: today,
        });

        // Goal already completed
        if (water && water.completed) {
            return res.json({
                message: "Today's water goal is already completed.",
                water,
            });
        }

        if (!water) {
            water = await WaterTracker.create({
                user: req.user.id,
                date: today,
            });
        }

        res.json(water);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Add Water
const addWater = async (req, res) => {
    try {

        const { amount } = req.body;

        const today = new Date().toDateString();

        let water = await WaterTracker.findOne({
            user: req.user.id,
            date: today,
        });

        // Already completed today
        if (water && water.completed) {
            return res.json({
                message: "Today's water goal already completed.",
                water,
            });
        }

        if (!water) {
            water = await WaterTracker.create({
                user: req.user.id,
                date: today,
            });
        }

        water.consumed += Number(amount);

        if (water.consumed >= water.goal) {
            water.completed = true;
        }

        await water.save();

        res.json(water);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getTodayWater,
    addWater,
};
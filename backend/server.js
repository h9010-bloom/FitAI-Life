require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const dietRoutes = require("./routes/dietRoutes");
const progressRoutes = require("./routes/progressRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mealRoutes = require("./routes/mealRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const adminRoutes = require("./routes/adminRoutes");
const checkInRoutes = require("./routes/checkInRoutes");
const userRoutes = require("./routes/userRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const waterRoutes = require("./routes/waterRoutes");
const sleepRoutes = require("./routes/sleepRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('FitAI-Life Backend Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/checkins", checkInRoutes);
app.use("/api/users", userRoutes);
app.use('/api/membership', membershipRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/sleep", sleepRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      goal,
      vegetarian,
      profileImage,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      goal,

      // Vegetarian = true
      // Non-Vegetarian = false
      vegetarian: Boolean(vegetarian),

      profileImage,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        vegetarian: newUser.vegetarian,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    res.status(200).json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vegetarian: user.vegetarian,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
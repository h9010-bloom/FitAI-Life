const ChatHistory = require("../models/ChatHistory");
const User = require("../models/User");
const geminiService = require("../utils/geminiService");

// =====================================
// USER : SEND MESSAGE TO AI
// =====================================

const sendMessage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    // Generate AI Response
    const aiResponse = await geminiService.generateResponse(prompt);

    console.log("AI Response:", aiResponse);

    // Save Chat
    const chat = await ChatHistory.create({
      user: req.user.id,
      prompt,
      response: aiResponse,
    });

    res.status(200).json({
      success: true,
      response: aiResponse,
      chat,
    });

  } catch (error) {

    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================
// USER : GET OWN CHAT HISTORY
// =====================================

const getChatHistory = async (req, res) => {
  try {

    const history = await ChatHistory.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      });

    res.status(200).json(history);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================
// USER : DELETE OWN CHAT HISTORY
// =====================================

const deleteChatHistory = async (req, res) => {
  try {

    await ChatHistory.deleteMany({
      user: req.user.id,
    });

    res.status(200).json({
      message: "Chat history deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================
// ADMIN : GET ALL CHAT HISTORY
// =====================================

const getAllChatHistory = async (req, res) => {
  try {

    const chats = await ChatHistory.find({})
      .populate("user", "name email goal")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(chats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================
// ADMIN : DELETE SINGLE CHAT
// =====================================

const deleteSingleChat = async (req, res) => {
  try {

    const chat = await ChatHistory.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    await ChatHistory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Chat deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================
// ADMIN : DELETE ALL CHATS
// =====================================

const deleteAllChats = async (req, res) => {
  try {

    await ChatHistory.deleteMany({});

    res.status(200).json({
      message: "All chat history deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// =====================================

module.exports = {

  // User
  sendMessage,
  getChatHistory,
  deleteChatHistory,

  // Admin
  getAllChatHistory,
  deleteSingleChat,
  deleteAllChats,

};
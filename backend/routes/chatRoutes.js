const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getChatHistory,
  deleteChatHistory,
  getAllChatHistory,
  deleteSingleChat,
  deleteAllChats,
} = require("../controllers/chatController");

// =====================================
// USER ROUTES
// =====================================

// Send message to AI
router.post(
  "/",
  protect,
  sendMessage
);

// Logged-in user's chat history
router.get(
  "/history",
  protect,
  getChatHistory
);

// Delete logged-in user's chat history
router.delete(
  "/history",
  protect,
  deleteChatHistory
);

// =====================================
// ADMIN ROUTES
// =====================================

// View all users' AI chat history
router.get(
  "/admin/history",
  getAllChatHistory
);

// Delete one chat
router.delete(
  "/admin/history/:id",
  deleteSingleChat
);

// Delete all chats
router.delete(
  "/admin/history",
  deleteAllChats
);

module.exports = router;
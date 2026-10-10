import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/aichat.css";

const API = "https://fitai-life-backend.onrender.com/api/chat";

function AIChat() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm FitAI-Life Assistant.\n\nI'm here to help you with workouts, diet plans, BMI, healthy habits, water intake and sleep.\n\nChoose a quick option below or ask me anything!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const quickQuestions = [
    "🏋 Create a workout plan",
    "🥗 Suggest a healthy diet",
    "⚖ How do I calculate BMI?",
    "💧 Daily water intake",
    "😴 Tips for better sleep",
  ];

  const sendMessage = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API,
        {
          prompt: question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "❌ Sorry! I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text:
          "👋 Hello! I'm FitAI-Life.\n\nHow can I help you today?",
      },
    ]);
  };
    return (
    <div className="ai-chat-page">

      {/* Header */}

      <div className="chat-header">

        <div className="header-icon">🤖</div>

        <h1>FitAI-Life Assistant</h1>

        <p>
          Your personal AI fitness coach. Ask anything about
          workouts, healthy diet, BMI, sleep and wellness.
        </p>

      </div>

      {/* Quick Suggestions */}

      <div className="quick-question-container">

        {quickQuestions.map((question, index) => (

          <button
            key={index}
            className="quick-btn"
            onClick={() => sendMessage(question)}
            disabled={loading}
          >
            {question}
          </button>

        ))}

      </div>

      {/* Chat Box */}

      <div className="chat-container">

        <div className="chat-messages">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`message ${message.sender}`}
            >

              {message.sender === "ai" && (

                <div className="avatar ai-avatar">
                  🤖
                </div>

              )}

              <div className="message-content">

                <strong>
                  {message.sender === "user"
                    ? "You"
                    : "FitAI-Life"}
                </strong>

                <p>{message.text}</p>

              </div>

              {message.sender === "user" && (

                <div className="avatar user-avatar">
                  👤
                </div>

              )}

            </div>

          ))}

          {loading && (

            <div className="message ai">

              <div className="avatar ai-avatar">
                🤖
              </div>

              <div className="message-content">

                <strong>FitAI-Life</strong>

                <p className="typing">
                  Typing<span>.</span><span>.</span><span>.</span>
                </p>

              </div>

            </div>

          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* Input */}

        <div className="chat-input-section">

          <textarea
            placeholder="Ask anything about fitness..."
            value={input}
            rows="2"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter" && !e.shiftKey) {

                e.preventDefault();

                sendMessage();

              }

            }}
          />

          <div className="button-group">

            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading}
            >

              {loading ? "Sending..." : "➤ Send"}

            </button>

            <button
              className="clear-btn"
              onClick={clearChat}
            >
              🗑 Clear Chat
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChat;
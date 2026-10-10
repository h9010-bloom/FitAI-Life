const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const model = process.env.OPENROUTER_MODEL;

async function generateResponse(prompt) {
  try {
    if (!model) {
      throw new Error("OPENROUTER_MODEL is missing.");
    }

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are FitAI-Life, a friendly AI fitness assistant. Help users with fitness, diet, exercise, weight loss, muscle gain, healthy habits, sleep, hydration, and wellness.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const response = completion?.choices?.[0]?.message?.content;

    if (!response || !response.trim()) {
      throw new Error("AI returned an empty response.");
    }

    return response.trim();
  } catch (error) {
    console.error("OpenRouter Error:", error.message);
    throw new Error("Failed to generate AI response.");
  }
}

module.exports = { generateResponse };
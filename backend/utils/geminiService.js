const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const model = process.env.OPENROUTER_MODEL;


async function generateResponse(prompt) {
  try {
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

    console.log("Selected Model:", model);

    console.log(
      "Complete AI Response:",
      JSON.stringify(completion.choices[0].message.content)
    );

    return completion.choices[0].message.content;

    console.log(
      "Selected Model:",
      model
    );

    console.log(
      "Complete AI Response:",
      JSON.stringify(completion.choices[0].message.content)
    );

    const response =
      completion?.choices?.[0]?.message?.content;

    if (!response || !response.trim()) {
      throw new Error("AI returned an empty response.");
    }

    return response.trim();

  } catch (error) {
    console.error("OpenRouter Error:", error.message);

    if (error.response?.data) {
      console.error(
        "OpenRouter Details:",
        error.response.data
      );
    }

    throw new Error("Failed to generate AI response.");
  }
}

module.exports = {
  generateResponse,
};
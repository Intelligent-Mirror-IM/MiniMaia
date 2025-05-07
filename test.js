import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.GPT_KEY,
});

async function askGPT4(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const response = await askGPT4("What is the capital of France?");
    console.log(response);
  } catch (error) {
    console.error("Main error:", error);
  }
}

main();

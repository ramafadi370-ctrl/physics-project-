import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Get AI response from Groq API
 * @param {string} message - The user's message
 * @param {string} mode - The mode: "explain", "summarize", or "solve"
 * @returns {Promise<string>} The AI response
 */
export async function askAI(message, mode = "explain") {
  let prompt = "";

  if (mode === "explain") {
    prompt =
      "You are an expert physics tutor. Explain the concept clearly and simply, as if teaching a high school student. Use examples when helpful. Break complex ideas into smaller parts.\n\nUser question:\n" +
      message;
  } else if (mode === "summarize") {
    prompt =
      "Summarize the following physics content concisely in 3-5 bullet points. Be clear and precise:\n\n" +
      message;
  } else {
    prompt =
      "Solve this physics problem step by step. Show all your work and explain each step. Include the formulas used and final answer.\n\n" +
      message;
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content || "No response generated";
}
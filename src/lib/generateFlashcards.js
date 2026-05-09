import axios from "axios";

export const generateFlashcards = async (chapterText) => {
  const prompt = `
You are a physics teacher.

From the following chapter text:
"""
${chapterText}
"""

Generate 10 multiple choice flashcards.

Return ONLY valid JSON in this format:
[
  {
    "question": "",
    "answer": "",
    "options": ["", "", "", ""]
  }
]
`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: "You generate flashcards only in JSON format." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
};
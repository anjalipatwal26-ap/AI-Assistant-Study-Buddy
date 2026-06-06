const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/api/claude", async (req, res) => {
  try {
    const { messages, max_tokens } = req.body;
    const prompt = messages.map(m => m.content).join("\n");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: max_tokens || 1000 },
        }),
      }
    );
    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: { message: data.error.message } });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(3001, () => console.log("✅ Backend running on http://localhost:3001"));
process.stdin.resume();
 import { useState } from "react";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ask = async (prompt, systemPrompt = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.map((b) => b.text || "").join("");
      return text;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const askJSON = async (prompt, systemPrompt = "") => {
    const raw = await ask(prompt, systemPrompt);
    if (!raw) return null;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch {
      setError("Failed to parse AI response.");
      return null;
    }
  };

  return { ask, askJSON, loading, error };
}

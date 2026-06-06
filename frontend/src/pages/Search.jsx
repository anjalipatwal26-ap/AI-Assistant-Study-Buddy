import { useState } from "react";
import "./Search.css";
import { useHistory } from "../hooks/useHistory";

export default function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { saveToHistory } = useHistory();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult("");
    setSources([]);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Give me a clear, student-friendly summary about: "${query}". Include key facts and explain it simply.`,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const fullText = data.content?.map(b => b.text || "").join("") || "No response.";
      setResult(fullText);
      setSources([]);
      saveToHistory("search", query, fullText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="mesh" />
      <div className="search-content">
        <div className="page-header">
          <div className="page-title">
            <div className="title-icon">🔍</div>
            <h1>AI Web Search</h1>
          </div>
          <p>Search the web and get a smart, student-friendly summary instantly.</p>
        </div>
        <div className="glass-card">
          <div className="input-label">What do you want to search?</div>
          <div className="search-row">
            <input
              className="search-input"
              placeholder="e.g. How does the immune system work?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
            >
              {loading ? "⏳" : "Search"}
            </button>
          </div>
        </div>
        {error && (
          <div className="error-box">⚠️ {error}</div>
        )}
        {loading && (
          <div className="glass-card loading-card">
            <div className="loading-icon">🌐</div>
            <p>Summarizing results...</p>
          </div>
        )}
        {result && !loading && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-tag">
                <div className="result-dot" />
                AI Summary
              </div>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copy 📋
              </button>
            </div>
            <div className="result-body">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
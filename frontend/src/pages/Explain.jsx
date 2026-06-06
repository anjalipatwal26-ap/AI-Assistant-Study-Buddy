// Explain.jsx
import { useState } from "react";
import "./Explain.css";
import { useHistory } from "../hooks/useHistory"; // 👈 added

const suggestions = ["Photosynthesis", "Newton's Laws", "Recursion", "Black Holes", "DNA Replication"];
const levels = [
  { key: "kid",     label: "🧒 5-year-old" },
  { key: "student", label: "🎓 Student"    },
  { key: "expert",  label: "🔬 Expert"     },
];

function ExplainIllo() {
  return (
    <svg className="illo-svg" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="140" cy="160" rx="100" ry="100" fill="rgba(139,92,246,0.06)"/>
      <rect x="60" y="100" width="160" height="120" rx="12" fill="#1a1530" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
      <rect x="60" y="100" width="16" height="120" rx="6" fill="rgba(139,92,246,0.5)"/>
      <rect x="90" y="125" width="100" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="90" y="140" width="82"  height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="90" y="155" width="92"  height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="90" y="170" width="66"  height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
      <rect x="90" y="185" width="78"  height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
      <circle cx="210" cy="72" r="26" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5"/>
      <circle cx="210" cy="72" r="14" fill="rgba(251,191,36,0.15)"/>
      <circle cx="210" cy="72" r="7"  fill="rgba(251,191,36,0.7)"/>
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <line key={i}
          x1={210 + Math.cos(deg*Math.PI/180)*20}
          y1={72  + Math.sin(deg*Math.PI/180)*20}
          x2={210 + Math.cos(deg*Math.PI/180)*30}
          y2={72  + Math.sin(deg*Math.PI/180)*30}
          stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      ))}
      <circle cx="50"  cy="80"  r="4" fill="rgba(139,92,246,0.7)"/>
      <circle cx="235" cy="170" r="3" fill="rgba(236,72,153,0.6)"/>
      <circle cx="45"  cy="195" r="3" fill="rgba(52,211,153,0.5)"/>
      <path d="M40 130 L42 124 L44 130 L50 132 L44 134 L42 140 L40 134 L34 132 Z" fill="rgba(139,92,246,0.5)"/>
      <path d="M238 110 L240 105 L242 110 L247 112 L242 114 L240 119 L238 114 L233 112 Z" fill="rgba(251,191,36,0.4)"/>
      <ellipse cx="140" cy="240" rx="65" ry="10" fill="rgba(139,92,246,0.1)"/>
    </svg>
  );
}

export default function Explain() {
  const [topic, setTopic]     = useState("");
  const [level, setLevel]     = useState("student");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const { saveToHistory } = useHistory(); // 👈 added

  const handleExplain = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    const levelMap = {
      kid:     "a 5-year-old child with zero prior knowledge",
      student: "a high school or college student",
      expert:  "a domain expert who wants technical depth",
    };
    const res = await fetch("http://localhost:3001/api/claude", {      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: `Explain "${topic}" clearly for ${levelMap[level]}. Use bold text (**like this**) to highlight key terms. Keep it engaging, accurate, and structured. End with a one-line fun fact.` }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || "").join("") || "Something went wrong.";
    setResult({ topic, text });
    saveToHistory("explain", topic, text); // 👈 added
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBold = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

  return (
    <div className="explain-page">
      <div className="mesh" />
      <div className="explain-layout">
        <div className="explain-content">
          <div className="page-header">
            <div className="page-title">
              <div className="title-icon">💡</div>
              <h1>Explain a Concept</h1>
            </div>
            <p>Type any topic and get a clear, simple explanation instantly.</p>
          </div>

          <div className="suggestions">
            <div className="suggestions-label">✦ Try one of these</div>
            <div className="sugg-row">
              {suggestions.map(s => (
                <button key={s} className="sugg-pill" onClick={() => setTopic(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="input-label">What do you want to understand?</div>
            <input
              className="topic-input"
              placeholder="e.g. Photosynthesis, Recursion, Quantum Entanglement..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleExplain()}
            />
            <div style={{ marginTop: "14px" }}>
              <div className="level-label">Explain it like I'm a...</div>
              <div className="level-row">
                {levels.map(l => (
                  <button key={l.key} className={`level-btn ${level === l.key ? "active" : ""}`} onClick={() => setLevel(l.key)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="explain-btn" onClick={handleExplain} disabled={loading || !topic.trim()}>
              {loading ? "⏳ Explaining..." : "✨ Explain It"}
            </button>
          </div>

          {result && (
            <div className="result-card">
              <div className="result-header">
                <div className="result-tag">
                  <span className="result-dot" />
                  AI Explanation — {result.topic}
                </div>
                <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "Copy"}</button>
              </div>
              <div className="result-body">
                {result.text.split("\n").map((line, i) => (
                  <p key={i} style={{ marginBottom: "0.6rem" }}>{renderBold(line)}</p>
                ))}
              </div>
              <div className="chips">
                <button className="chip">🃏 Make Flashcards</button>
                <button className="chip">🧠 Quiz Me</button>
                <button className="chip">📝 Summarize</button>
                <button className="chip">🔍 Go Deeper</button>
              </div>
            </div>
          )}
        </div>

        <div className="explain-illo">
          <ExplainIllo />
          <div className="illo-tip">
            💡 Tip: Try <strong>Student</strong> mode first, then switch to <strong>Expert</strong> to go deeper!
          </div>
        </div>
      </div>
    </div>
  );
}
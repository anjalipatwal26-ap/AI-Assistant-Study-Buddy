// Summarize.jsx
import { useState } from "react";
import "./Summarize.css";
import { useHistory } from "../hooks/useHistory"; // 👈 added

const styles = [
  { key: "bullets",   label: "📌 Key Points" },
  { key: "paragraph", label: "📄 Paragraph"  },
  { key: "oneliner",  label: "🐦 One-liner"  },
];

export default function Summarize() {
  const [text, setText]       = useState("");
  const [style, setStyle]     = useState("bullets");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const { saveToHistory } = useHistory(); // 👈 added

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    const stylePrompt = {
      bullets:   "Return ONLY a bullet-point list of 4–6 key points. Each point starts with a dash (-).",
      paragraph: "Return ONLY a concise 3–4 sentence paragraph summary.",
      oneliner:  "Return ONLY a single sentence (max 30 words) capturing the core idea.",
    };

    const res = await fetch("http://localhost:3001/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Summarize the following text. ${stylePrompt[style]}
Bold (**like this**) the most important terms or phrases.

TEXT:
${text}`,
        }],
      }),
    });

    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "";
    const summaryWords = raw.trim().split(/\s+/).length;
    const saved = Math.max(0, wordCount - summaryWords);
    const reduction = wordCount > 0 ? Math.round((saved / wordCount) * 100) : 0;
    const points = style === "bullets" ? raw.split("\n").filter(l => l.trim().startsWith("-")).length : null;

    setResult({ raw, summaryWords, saved, reduction, points, style });
    saveToHistory("summarize", text.slice(0, 60) + "...", raw); // 👈 added
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBold = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

  const renderResult = () => {
    if (!result) return null;
    if (result.style === "bullets") {
      const lines = result.raw.split("\n").filter(l => l.trim().startsWith("-"));
      return lines.map((line, i) => (
        <div key={i} className="bullet">
          <div className="bullet-dot" />
          <div>{renderBold(line.replace(/^-\s*/, ""))}</div>
        </div>
      ));
    }
    return result.raw.split("\n").filter(Boolean).map((para, i) => (
      <p key={i} style={{ marginBottom: "0.6rem" }}>{renderBold(para)}</p>
    ));
  };

  return (
    <div className="summarize-page">
      <div className="mesh" />
      <div className="summarize-content">

        <div className="page-header">
          <div className="page-title">
            <div className="title-icon">📝</div>
            <h1>Summarize Text</h1>
          </div>
          <p>Paste any text and get a clean, concise summary instantly.</p>
        </div>

        <div className="two-col">
          <div className="glass-card">
            <div className="input-label">Paste your text</div>
            <textarea
              className="text-area"
              placeholder={"Paste your notes, article, chapter, or any long text here...\n\nThe AI will extract the key points for you."}
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="word-count">{wordCount} words</div>

            <div style={{ marginTop: "4px" }}>
              <div className="input-label">Summary style</div>
              <div className="style-row">
                {styles.map(s => (
                  <button
                    key={s.key}
                    className={`style-btn ${style === s.key ? "active" : ""}`}
                    onClick={() => setStyle(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="summarize-btn"
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
            >
              {loading ? "⏳ Summarizing..." : "✨ Summarize"}
            </button>
          </div>

          <div className="result-card">
            <div className="result-header">
              <div className="result-tag"><span className="result-dot" /> Summary</div>
              {result && <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "Copy"}</button>}
            </div>

            {result ? (
              <>
                <div className="result-body">{renderResult()}</div>
                <div className="stats-row">
                  {result.points && (
                    <div className="stat-pill">
                      <div className="stat-num">{result.points}</div>
                      <div className="stat-lbl">Key points</div>
                    </div>
                  )}
                  <div className="stat-pill">
                    <div className="stat-num">{result.reduction}%</div>
                    <div className="stat-lbl">Shorter</div>
                  </div>
                  <div className="stat-pill">
                    <div className="stat-num">{result.saved}</div>
                    <div className="stat-lbl">Words saved</div>
                  </div>
                </div>
                <div className="chips">
                  <button className="chip">🃏 Make Flashcards</button>
                  <button className="chip">🧠 Quiz Me</button>
                  <button className="chip">💡 Explain More</button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <div className="empty-text">Your summary will appear here.<br />Paste text on the left and hit Summarize.</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
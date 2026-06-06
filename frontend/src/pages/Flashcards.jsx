// Flashcards.jsx
import { useState } from "react";
import "./Flashcards.css";
import { useHistory } from "../hooks/useHistory"; // 👈 added

const COUNTS = [5, 10, 15, 20];

export default function Flashcards() {
  const [topic, setTopic]       = useState("");
  const [count, setCount]       = useState(10);
  const [loading, setLoading]   = useState(false);
  const [cards, setCards]       = useState([]);
  const [current, setCurrent]   = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [results, setResults]   = useState([]);
  const [done, setDone]         = useState(false);
  const { saveToHistory } = useHistory(); // 👈 added

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCards([]); setResults([]);
    setCurrent(0); setFlipped(false); setDone(false);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Create ${count} flashcards about "${topic}".
Return ONLY valid JSON — no markdown, no backticks, no extra text.
Format:
[
  { "term": "...", "definition": "..." }
]
Keep definitions concise (1-2 sentences max).`,
        }],
      }),
    });

    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "[]";
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCards(parsed);
      saveToHistory("flashcards", topic, `${count} flashcards generated about "${topic}"`); // 👈 added
    } catch {
      setCards([]);
    }
    setLoading(false);
  };

  const handleResult = (result) => {
    const newResults = [...results, result];
    setResults(newResults);
    setFlipped(false);
    setTimeout(() => {
      if (current + 1 >= cards.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 200);
  };

  const handleRestart = () => {
    setCurrent(0); setFlipped(false);
    setResults([]); setDone(false);
  };

  const knownCount = results.filter(r => r === "known").length;
  const card = cards[current];

  const getDotClass = (i) => {
    if (i < results.length) return results[i] === "known" ? "prog-dot known" : "prog-dot skipped";
    if (i === current) return "prog-dot current";
    return "prog-dot";
  };

  return (
    <div className="flashcards-page">
      <div className="mesh" />
      <div className="flashcards-content">

        <div className="page-header">
          <div className="page-title">
            <div className="title-icon">🃏</div>
            <h1>Flashcards</h1>
          </div>
          <p>Generate smart flashcards on any topic and study at your own pace.</p>
        </div>

        {/* Setup */}
        {cards.length === 0 && !loading && (
          <div className="glass-card">
            <div className="input-label">Topic</div>
            <input
              className="topic-input"
              placeholder="e.g. Organic Chemistry, Spanish Vocab, Git commands..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
            />
            <div>
              <div className="input-label" style={{ marginTop: "14px" }}>Number of cards</div>
              <div className="row">
                {COUNTS.map(n => (
                  <button
                    key={n}
                    className={`opt-btn ${count === n ? "active" : ""}`}
                    onClick={() => setCount(n)}
                  >{n}</button>
                ))}
              </div>
            </div>
            <button className="gen-btn" onClick={handleGenerate} disabled={!topic.trim()}>
              🃏 Generate Flashcards
            </button>
          </div>
        )}

        {loading && (
          <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Generating your flashcards...</p>
          </div>
        )}

        {/* Study mode */}
        {cards.length > 0 && !done && card && (
          <>
            <div className="progress-row">
              {cards.map((_, i) => (
                <div key={i} className={getDotClass(i)} />
              ))}
            </div>

            <div className="card-area">
              <div
                className={`flashcard ${flipped ? "flipped" : ""}`}
                onClick={() => setFlipped(f => !f)}
              >
                <div className="card-face card-front">
                  <div className="card-tag front-tag">Term</div>
                  <div className="card-word">{card.term}</div>
                  <div className="card-hint">Click to reveal definition</div>
                </div>
                <div className="card-face card-back">
                  <div className="card-tag back-tag">Definition</div>
                  <div className="card-def">{card.definition}</div>
                </div>
              </div>
            </div>

            <div className="flip-hint">🖱 Click card to flip</div>

            <div className="controls">
              <button className="ctrl-btn skip" onClick={() => handleResult("skip")}>
                ✗ Don't Know
              </button>
              <div className="card-counter">{current + 1} / {cards.length}</div>
              <button className="ctrl-btn know" onClick={() => handleResult("known")}>
                ✓ Got It
              </button>
            </div>
          </>
        )}

        {/* Done screen */}
        {done && (
          <div className="done-card">
            <div className="done-emoji">
              {knownCount / cards.length >= 0.8 ? "🏆" : knownCount / cards.length >= 0.5 ? "👍" : "📚"}
            </div>
            <div className="done-num">{knownCount}/{cards.length}</div>
            <div className="done-sub">cards mastered</div>
            <div className="done-sub" style={{ marginTop: "6px" }}>
              {knownCount / cards.length >= 0.8
                ? "Amazing! You know this topic well."
                : knownCount / cards.length >= 0.5
                ? "Good progress! Review the ones you missed."
                : "Keep studying — you're getting there!"}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "1.5rem" }}>
              <button className="restart-btn" onClick={handleRestart}>🔄 Study Again</button>
              <button className="restart-btn" style={{ background: "rgba(255,255,255,0.08)", boxShadow: "none" }} onClick={() => { setCards([]); setDone(false); }}>
                ＋ New Topic
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
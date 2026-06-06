// Quiz.jsx
import { useState } from "react";
import "./Quiz.css";
import { useHistory } from "../hooks/useHistory"; // 👈 added

const COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ["🟢 Easy", "🟡 Medium", "🔴 Hard"];

export default function Quiz() {
  const [topic, setTopic]         = useState("");
  const [count, setCount]         = useState(10);
  const [difficulty, setDiff]     = useState("🟢 Easy");
  const [loading, setLoading]     = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answers, setAnswers]     = useState([]);
  const [finished, setFinished]   = useState(false);
  const { saveToHistory } = useHistory(); // 👈 added

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]); setAnswers([]); setCurrent(0);
    setSelected(null); setFinished(false);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Generate ${count} multiple choice quiz questions about "${topic}" at ${difficulty.replace(/[🟢🟡🔴]\s/,"")} difficulty.
Return ONLY valid JSON — no markdown, no backticks, no preamble.
Format:
[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "B"
  }
]`,
        }],
      }),
    });

    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "[]";
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed);
      saveToHistory("quiz", topic, `${count} questions at ${difficulty} difficulty`); // 👈 added
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleSelect = (letter) => {
    if (selected) return;
    setSelected(letter);
    setAnswers(prev => [...prev, letter === questions[current].answer]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const handleRetry = () => {
    setQuestions([]); setAnswers([]);
    setCurrent(0); setSelected(null); setFinished(false);
  };

  const score = answers.filter(Boolean).length;
  const q = questions[current];
  const progress = questions.length > 0 ? ((current) / questions.length) * 100 : 0;

  return (
    <div className="quiz-page">
      <div className="mesh" />
      <div className="quiz-content">

        <div className="page-header">
          <div className="page-title">
            <div className="title-icon">🧠</div>
            <h1>Quiz Yourself</h1>
          </div>
          <p>Generate a quiz on any topic and test your knowledge instantly.</p>
        </div>

        {/* Setup */}
        {questions.length === 0 && !loading && (
          <div className="glass-card">
            <div className="input-label">Quiz topic</div>
            <input
              className="topic-input"
              placeholder="e.g. World War II, Calculus, Python basics..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
            />
            <div style={{ marginTop: "14px" }}>
              <div className="input-label">Number of questions</div>
              <div className="row">
                {COUNTS.map(n => (
                  <button key={n} className={`opt-btn ${count === n ? "active" : ""}`} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "14px" }}>
              <div className="input-label">Difficulty</div>
              <div className="row">
                {DIFFICULTIES.map(d => (
                  <button key={d} className={`opt-btn ${difficulty === d ? "active" : ""}`} onClick={() => setDiff(d)}>{d}</button>
                ))}
              </div>
            </div>
            <button className="quiz-btn" onClick={handleGenerate} disabled={!topic.trim()}>
              🧠 Generate Quiz
            </button>
          </div>
        )}

        {loading && (
          <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Generating your quiz...</p>
          </div>
        )}

        {/* Quiz in progress */}
        {questions.length > 0 && !finished && q && (
          <>
            <div className="progress-label">
              <span>Question {current + 1} of {questions.length}</span>
              <span style={{ color: "#f472b6" }}>{score} correct</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="q-card">
              <div className="q-num">Question {current + 1} of {questions.length}</div>
              <div className="q-text">{q.question}</div>
              <div className="options">
                {q.options.map((opt, i) => {
                  const letter = ["A","B","C","D"][i];
                  const isCorrect = letter === q.answer;
                  const isSelected = letter === selected;
                  let cls = "option";
                  if (selected) {
                    if (isCorrect) cls += " correct";
                    else if (isSelected) cls += " wrong";
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleSelect(letter)}>
                      <span className="option-letter">{letter}</span>
                      {opt.replace(/^[A-D]\)\s*/, "")}
                      {selected && isCorrect ? " ✓" : ""}
                      {selected && isSelected && !isCorrect ? " ✗" : ""}
                    </button>
                  );
                })}
              </div>
              {selected && (
                <button className="quiz-btn" style={{ marginTop: "1.25rem" }} onClick={handleNext}>
                  {current + 1 >= questions.length ? "See Results →" : "Next Question →"}
                </button>
              )}
            </div>
          </>
        )}

        {/* Score screen */}
        {finished && (
          <div className="score-card">
            <div className="score-emoji">
              {score / questions.length >= 0.8 ? "🏆" : score / questions.length >= 0.5 ? "👍" : "📚"}
            </div>
            <div className="score-num">{score}/{questions.length}</div>
            <div className="score-sub">
              {score / questions.length >= 0.8 ? "Excellent! You nailed it." : score / questions.length >= 0.5 ? "Good effort! Keep studying." : "Keep going — practice makes perfect!"}
            </div>
            <div className="score-sub" style={{ marginTop: "6px" }}>
              {Math.round((score / questions.length) * 100)}% correct
            </div>
            <button className="retry-btn" onClick={handleRetry}>🔄 Try Again</button>
          </div>
        )}

      </div>
    </div>
  );
}
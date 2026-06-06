// Home.jsx
import "./Home.css";

const features = [
  { icon: "💡", label: "Explain",    desc: "Break down any concept into simple, clear explanations.", page: "explain",    color: "rgba(139,92,246,0.15)",  glow: "rgba(139,92,246,0.08)" },
  { icon: "📝", label: "Summarize", desc: "Condense long texts into key points instantly.",           page: "summarize",  color: "rgba(52,211,153,0.12)",  glow: "rgba(52,211,153,0.08)"  },
  { icon: "🧠", label: "Quiz",      desc: "Test your knowledge with AI-generated questions.",         page: "quiz",       color: "rgba(244,114,182,0.12)", glow: "rgba(244,114,182,0.08)" },
  { icon: "🃏", label: "Flashcards",desc: "Create smart flashcard decks to retain more.",             page: "flashcards", color: "rgba(251,146,60,0.12)",  glow: "rgba(251,146,60,0.08)"  },
];

export default function Home({ setPage }) {
  return (
    <div className="home-page">
      <div className="mesh" />

      <section className="hero">
        <div className="hero-left">
          <div className="badge">
            <span className="badge-dot" />
            AI-Powered Learning
          </div>
          <h1>Learn anything,<br /><span className="grad">faster &amp; smarter</span></h1>
          <p>Your personal AI study companion. Explain complex topics, summarize notes, generate quizzes, and create flashcards in seconds.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setPage("explain")}>🚀 Get Started Free</button>
            <button className="btn-secondary">Watch Demo →</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="illustration">
            📖
            <span className="orb orb1" />
            <span className="orb orb2" />
            <span className="orb orb3" />
          </div>
        </div>
      </section>

      <section className="features">
        {features.map(({ icon, label, desc, page, color, glow }) => (
          <div
            key={label}
            className="feat-card"
            style={{ "--card-glow": `radial-gradient(ellipse at top left, ${glow}, transparent)` }}
            onClick={() => setPage(page)}
          >
            <div className="feat-icon" style={{ background: color }}>{icon}</div>
            <h3>{label}</h3>
            <p>{desc}</p>
            <span className="feat-arrow">↗</span>
          </div>
        ))}
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-num purple">50K+</div>
          <div className="stat-label">Active students</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num green">2M+</div>
          <div className="stat-label">Concepts explained</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num pink">98%</div>
          <div className="stat-label">Satisfaction rate</div>
        </div>
      </section>
    </div>
  );
}
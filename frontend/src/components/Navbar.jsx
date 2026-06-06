// Navbar.jsx
import { useState } from "react";
import "./Navbar.css";

const navItems = [
  { id: "home",       label: "Home"       },
  { id: "explain",    label: "Explain"    },
  { id: "summarize",  label: "Summarize"  },
  { id: "quiz",       label: "Quiz"       },
  { id: "flashcards", label: "Flashcards" },
  { id: "search",     label: "Search"     },
  { id: "history",    label: "History"    },
];

export default function Navbar({ page, setPage }) {
  const [dark, setDark] = useState(true);

  return (
    <nav className="navbar">
      <button onClick={() => setPage("home")} className="logo">
        <div className="logo-icon">📚</div>
        <span className="logo-text">Study<span>Buddy</span></span>
      </button>

      <ul className="nav-links">
        {navItems.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => setPage(id)}
              className={page === id ? "active" : ""}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
        <div className="avatar">A</div>
      </div>
    </nav>
  );
}
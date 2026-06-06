 import { useState, useEffect } from "react";
import { useHistory } from "../hooks/useHistory";
import "./History.css";

const TYPE_COLORS = {
  explain:    { bg: "type-yellow", label: "💡 Explain"    },
  summarize:  { bg: "type-green",  label: "📝 Summarize"  },
  quiz:       { bg: "type-purple", label: "🧠 Quiz"       },
  flashcards: { bg: "type-orange", label: "🃏 Flashcards" },
  search:     { bg: "type-blue",   label: "🔍 Search"     },
};

export default function History() {
  const { getHistory, deleteItem, clearAll } = useHistory();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleDelete = (id) => {
    deleteItem(id);
    setItems(getHistory());
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all history?")) {
      clearAll();
      setItems([]);
    }
  };

  const filtered = filter === "all"
    ? items
    : items.filter((i) => i.type === filter);

  return (
    <div className="history-page">
      <div className="mesh" />
      <div className="history-content">

        {/* Header */}
        <div className="page-header">
          <div className="page-title">
            <div className="title-icon">📖</div>
            <h1>History</h1>
          </div>
          <p>All your past AI sessions saved here for quick review.</p>
        </div>

        {/* Filter + Clear */}
        <div className="history-toolbar">
          <div className="filter-row">
            {["all", "explain", "summarize", "quiz", "flashcards", "search"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? "active" : ""}`}
              >
                {f === "all" ? "All" : TYPE_COLORS[f]?.label}
              </button>
            ))}
          </div>
          {items.length > 0 && (
            <button onClick={handleClearAll} className="clear-btn">
              🗑 Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No history yet</p>
            <p className="empty-sub">
              Start using Explain, Summarize, Quiz, Flashcards or Search —
              your sessions will appear here.
            </p>
          </div>
        )}

        {/* History Items */}
        <div className="history-list">
          {filtered.map((item) => (
            <div key={item.id} className="history-card">
              <div className="card-top">
                <div className="card-left">
                  <span className={`type-badge ${TYPE_COLORS[item.type]?.bg}`}>
                    {TYPE_COLORS[item.type]?.label}
                  </span>
                  <span className="card-topic">{item.topic}</span>
                </div>
                <div className="card-right">
                  <span className="card-date">{item.date} {item.time}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                  >✕</button>
                </div>
              </div>

              {/* Preview */}
              <p className="card-preview">
                {expanded === item.id
                  ? item.result
                  : item.result?.slice(0, 120) + (item.result?.length > 120 ? "..." : "")}
              </p>

              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="expand-btn"
              >
                {expanded === item.id ? "Show Less ▲" : "Show More ▼"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

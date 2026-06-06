import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explain from "./pages/Explain";
import Summarize from "./pages/Summarize";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Search from "./pages/Search";
import History from "./pages/History";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":       return <Home setPage={setPage} />;
      case "explain":    return <Explain />;
      case "summarize":  return <Summarize />;
      case "quiz":       return <Quiz />;
      case "flashcards": return <Flashcards />;
      case "search":     return <Search />;
      case "history":    return <History />;
      default:           return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] text-gray-900">
      <Navbar page={page} setPage={setPage} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {renderPage()}
      </main>
    </div>
  );
}
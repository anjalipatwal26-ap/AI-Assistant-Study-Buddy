 
const KEY = "studybuddy_history";

export function useHistory() {

  const getHistory = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveToHistory = (type, topic, result) => {
    const history = getHistory();
    const newItem = {
      id: Date.now(),
      type,      // "explain" | "summarize" | "quiz" | "flashcards" | "search"
      topic,
      result,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    const updated = [newItem, ...history].slice(0, 50); // max 50 items
    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  const deleteItem = (id) => {
    const updated = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  const clearAll = () => localStorage.removeItem(KEY);

  return { getHistory, saveToHistory, deleteItem, clearAll };
}
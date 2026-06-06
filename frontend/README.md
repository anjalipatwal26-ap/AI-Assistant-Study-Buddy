# 📚 StudyBuddy — AI-Powered Study Companion

> Learn anything, faster & smarter. Your personal AI study companion powered by Google Gemini AI.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 💡 **Explain** | Break down any concept into simple explanations — choose between 5-year-old, student, or expert level |
| 📝 **Summarize** | Paste any text and get key bullet points, a paragraph, or a one-liner summary instantly |
| 🧠 **Quiz** | Generate multiple-choice quizzes on any topic with difficulty levels and a live score tracker |
| 🃏 **Flashcards** | Create flip-card decks to study terms and definitions with a Got It / Don't Know tracker |
| 🔍 **Search** | Search and explore any topic with AI-powered results |

---

## 🗂️ Project Structure

```
study-buddy/
├── backend/
│   ├── server.js          # Express server — handles Gemini API calls
│   ├── package.json
│   └── .env               # GEMINI_API_KEY, PORT=3001 (never commit!)
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Navbar.css
│       ├── hooks/
│       ├── pages/
│       │   ├── Home.jsx & Home.css
│       │   ├── Explain.jsx & Explain.css
│       │   ├── Summarize.jsx & Summarize.css
│       │   ├── Quiz.jsx & Quiz.css
│       │   ├── Flashcards.jsx & Flashcards.css
│       │   └── Search.jsx & Search.css
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router DOM |
| **Styling** | Plain CSS — glassmorphism, gradient mesh backgrounds |
| **Backend** | Node.js, Express.js |
| **AI** | Google Gemini API |
| **Dev Tools** | ESLint, Prettier, Tailwind CSS, PostCSS |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- A [Google Gemini API key](https://aistudio.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/anjalipatwal26-ap/AI-Assistant-Study-Buddy.git
cd AI-Assistant-Study-Buddy
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Start the backend:

```bash
node server.js
```

Backend runs on **http://localhost:3001**

---

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## ⚠️ Security — API Key

> **Never commit your `.env` file to GitHub.**

Your `.gitignore` should always include:

```
.env
node_modules/
dist/
```

If you accidentally pushed your API key, regenerate it immediately at [Google AI Studio](https://aistudio.google.com/).

---

## 🎮 How to Use

### 💡 Explain
1. Go to the **Explain** tab
2. Type any concept (e.g. "Photosynthesis", "Recursion", "Black Holes")
3. Pick your level — 5-year-old / Student / Expert
4. Click **Explain It** for an instant AI explanation

### 📝 Summarize
1. Go to the **Summarize** tab
2. Paste any text — notes, articles, chapters
3. Choose style: Key Points / Paragraph / One-liner
4. Click **Summarize** for a concise summary with stats

### 🧠 Quiz
1. Go to the **Quiz** tab
2. Enter a topic, choose number of questions and difficulty
3. Click **Generate Quiz** and answer the MCQs
4. See your final score at the end

### 🃏 Flashcards
1. Go to the **Flashcards** tab
2. Enter a topic and number of cards
3. Click **Generate Flashcards**
4. Flip each card — click **Got It** or **Don't Know** to track progress

### 🔍 Search
1. Go to the **Search** tab
2. Search any topic to explore AI-powered results

---

## 🔧 Build for Production

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/`.

---

## 🌐 Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your repo, set root directory to `backend`
3. Add environment variable: `GEMINI_API_KEY=your_key`
4. Start command: `node server.js`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set root directory to `frontend`
3. Set environment variable for your backend URL

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👩‍💻 Author

Made with ❤️ by [Anjali Patwal](https://github.com/anjalipatwal26-ap)

---

> ⭐ Star the repo if you found it helpful!
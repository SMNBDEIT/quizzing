Quizzing
A modern, lightweight quiz platform built with React. Create quizzes as a registered Quizzer, share them with anyone, and let players test their knowledge with a clean timed interface.

✨ Features

Browse & play quizzes without an account
Register as a Quizzer to create, edit, and delete your own quizzes
Timed questions — 20 seconds per question with a live countdown
Instant feedback — correct / wrong answer highlighted after every response
Score screen — percentage ring, correct/wrong breakdown, and a replay option
Persistent storage — quizzes and accounts survive page refreshes
Responsive layout — works on desktop and mobile


🖥️ Preview
HomePlayResultsBrowse all quizzes, register or log inTimed question with 4 answer optionsScore ring with correct/wrong stats

🚀 Getting Started
Prerequisites

Node.js v18 or later
A React project scaffold (Vite or Create React App)

Installation
bash# 1. Clone the repository
git clone https://github.com/SMNBDEIT/quizzing.git
cd quizzing

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
Usage
Drop Quizzing.jsx into your src/ folder and import it as the root component:
jsx// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Quizzing'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

Note: Quizzing.jsx requires window.storage — a simple key/value storage API. In the Claude artifact environment this is built in. For standalone deployment, replace the DB helper at the top of the file with localStorage or any backend of your choice (see Adapting the Storage Layer below).


📁 Project Structure
quizzing/
├── src/
│   └── Quizzing.jsx   ← entire app in one self-contained file
├── public/
│   └── index.html
├── package.json
└── README.md
All screens, components, styles, and logic live in one file — no external UI libraries required.

🗺️ App Screens
ScreenRouteAccessHome/EveryoneLogin / Register/authEveryoneDashboard/dashLogged-in QuizzersCreate / Edit Quiz/createLogged-in QuizzersPlay Quiz/playEveryoneResults/resultsEveryone

🎮 How to Play

Open the app — all published quizzes appear on the home screen.
Click ▶ Play on any quiz card.
Read the question and click one of the four numbered answer options before the timer runs out.
See instant feedback, then move to the next question.
Review your score on the results screen and replay if you want to beat it.


✏️ Creating a Quiz

Register using the button in the top-right corner — this gives you a Quizzer account.
Go to your Dashboard and click + New Quiz.
Fill in a title and optional description.
Add as many questions as you like. Each question has four answer options — click the numbered badge (01–04) to mark the correct one.
Click Publish Quiz — it immediately appears on the home screen for everyone.

You can edit or delete your quizzes at any time from the Dashboard.

🔧 Adapting the Storage Layer
The DB object at the top of Quizzing.jsx is the only part that touches storage:
jsconst DB = {
  async get(k)    { /* read a value by key  */ },
  async put(k, v) { /* write a value by key */ },
};
Swap the bodies to use any backend — localStorage, IndexedDB, Firebase, Supabase, etc.
localStorage example:
jsconst DB = {
  async get(k)    { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; },
  async put(k, v) { localStorage.setItem(k, JSON.stringify(v)); return true; },
};

🎨 Design
TokenValueUsed forBackground#09090bPage baseSurface#111113CardsLime#d4f74aPrimary accent, CTA buttonsCoral#ff6b4aWrong answers, delete actionsEmerald#4ade80Correct answersViolet#a78bfaSecondary accentFontsSyne + DM SansHeadings + body
Styles are written entirely as CSS-in-JS strings — no stylesheet, no Tailwind, no external CSS library.

🛣️ Roadmap

 Leaderboard per quiz
 Quiz categories / tags
 Configurable time limit per question
 Image support in questions
 Public profile page per Quizzer


🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/my-feature
Commit your changes: git commit -m "add my feature"
Push to the branch: git push origin feature/my-feature
Open a Pull Request


📄 License
MIT © SMNBDEIT

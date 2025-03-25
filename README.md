<h1 align="center">🧠 CodeCue – Smart LeetCode Assistant</h1>
<p align="center">
  A browser extension that provides smart hints, structured algorithm summaries, and Python solutions for LeetCode problems using a free LLM (Groq) via a secure backend proxy.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Built_with-React-blue?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/API-Groq-blueviolet?style=flat" />
  <img src="https://img.shields.io/badge/Chrome_Extension-TypeScript-yellowgreen?style=flat" />
</p>

---

## ✨ Features

- 🧠 3 Levels of progressive hints (basic → helpful → almost a solution)
- 📘 Structured algorithm summaries
- 🐍 Python solutions
- 🕵️ Auto-detects the current LeetCode problem
- 🔐 Backend proxy to securely call Groq API (API key hidden)

---

## 🧱 Tech Stack

- **Frontend**: React + TypeScript + Vite (Chrome Extension)
- **Backend**: Node.js + Express + Groq API
- **Hosting**: Supports Render, Vercel, Railway
- **Language Model**: LLaMA 3 via Groq

---

## 🛠️ Getting Started

### 1️⃣ Clone the Project

```bash
git clone https://github.com/veeoid/Code-Cue.git
cd codecue
```

## 🔐 2. Set Up Backend Proxy

```
cd proxy-server
npm install
```

Create a .env file:

```
GROQ_API_KEY=your_groq_api_key_here
```

Start the proxy:

```
node server.js
```

This starts the proxy server at http://localhost:3000/api/groq

## 🧩 3. Set Up Chrome Extension

```
cd ../codecue
npm install
npm run build
```

## 🧪 4. Load Extension in Chrome

Go to chrome://extensions

Enable Developer Mode

Click “Load unpacked”

Select the dist/ folder from extension/

Open any LeetCode problem → Click on the CodeCue icon → Try hints, summary, or solution!


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
- **Hosting**: Vercel (Supports others like Render, Railway too)
- **Language Model**: LLaMA 3 via Groq

---

## 🛠️ Getting Started

### 1️⃣ Clone the Project

```bash
git clone https://github.com/veeoid/Code-Cue.git
cd Code-Cue
```

### 2️⃣ Set Up Backend Proxy

```bash
cd proxy-server
npm install
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the proxy locally (if testing):

```bash
node server.js
```

Or deploy to Vercel and set the environment variable there.

### 3️⃣ Set Up Chrome Extension

```bash
cd ../codecue
npm install
npm run build
```

### 4️⃣ Load Extension in Chrome

- Go to `chrome://extensions`
- Enable **Developer Mode**
- Click “**Load unpacked**”
- Select the `dist/` folder from `codecue`

---

## 🚀 How It Works

- The extension detects the LeetCode problem you're on
- Sends a prompt to your backend (`/api/groq`)
- Backend uses Groq API (LLaMA3) to fetch intelligent hints or summaries
- Response is shown instantly in your popup tab

---

## 🔒 API Key Security

- Your Groq API Key is **never exposed** in frontend code
- Stored securely via Vercel’s **Environment Variables**

---

## 📦 Deploy to Vercel

- Link this GitHub repo to Vercel
- Set `proxy-server` as **Root Directory** in settings
- Add environment variable: `GROQ_API_KEY`
- Vercel auto-deploys on every commit

---



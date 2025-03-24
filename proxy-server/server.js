// A minimal proxy server using Express for your Chrome extension
// Save this as server.js or index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/groq", async (req, res) => {
  const { prompt } = req.body;

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const data = await groqRes.json();
    return res.json({
      result: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy request failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});

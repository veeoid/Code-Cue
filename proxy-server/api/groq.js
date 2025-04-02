// File: api/groq.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("📥 Hit /api/groq with method:", req.method);

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ message: "GET route working ✅" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  console.log("🔍 Loaded GROQ_API_KEY?", !!GROQ_API_KEY); // 👈 Add this

  if (!GROQ_API_KEY) {
    console.log("❌ GROQ_API_KEY is missing from environment!");
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not set in environment" });
  }

  console.log(
    "🔐 GROQ_API_KEY loaded, partial:",
    GROQ_API_KEY.slice(0, 6) + "..." + GROQ_API_KEY.slice(-4)
  );

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
          // model: "llama3-70b-8192",
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const data = await groqRes.json();
    return res
      .status(200)
      .json({ result: data.choices?.[0]?.message?.content || "No response" });
  } catch (error) {
    console.error("Groq proxy error:", error);
    return res.status(500).json({ error: "Proxy request failed." });
  }
}

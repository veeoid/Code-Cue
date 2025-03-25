// popup/Tabs/Summary.tsx
import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

export default function Summary({ question }: { question: string }) {
  const [summary, setSummary] = useState("");

  const getSummary = async () => {
    const prompt = `Explain the algorithm to solve the following LeetCode question in a brief and structured format. Use bullet points or step-wise format. Avoid unnecessary introductions or commentary. Use simple language.

Question:
${question}`;

    const response = await fetchFromGroq(prompt);
    setSummary(response);
  };

  return (
    <div>
      <button onClick={getSummary}>Get Pseudocode</button>
      {summary && (
  <div style={{ overflowX: "auto", maxWidth: "100%" }}>
    <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
  </div>
)}

    </div>
  );
}

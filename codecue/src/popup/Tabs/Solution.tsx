// popup/Tabs/Solution.tsx
import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

export default function Solution({ question }: { question: string }) {
  const [solution, setSolution] = useState("");

  const getSolution = async () => {
    const prompt = `Give me a Python solution for the following LeetCode problem with explanation: ${question}`;
    const response = await fetchFromGroq(prompt);
    setSolution(response);
  };

  return (
    <div>
      <button onClick={getSolution}>Get Python Solution</button>
      {solution && (
  <div style={{ overflowX: "auto", maxWidth: "100%" }}>
    <pre style={{ whiteSpace: "pre-wrap" }}>{solution}</pre>
  </div>
)}

    </div>
  );
}

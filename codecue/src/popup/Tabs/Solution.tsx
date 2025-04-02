import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

export default function Solution({ question }: { question: string }) {
  const [solution, setSolution] = useState("");
  const [explanation, setExplanation] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const getSolution = async () => {
    const promptForCode = `Just return a valid Python function wrapped in a class Solution for the following LeetCode problem. Do NOT include any explanation or markdown formatting like triple backticks. Do not include the word 'Explanation' or anything extra.

Question:
${question}`;

    const promptForExplanation = `Explain the approach and logic behind solving this LeetCode problem in simple terms. Use clear bullet points or concise paragraphs. Do not include any code or markdown formatting.

Question:
${question}`;

    const [codeResponse, explanationResponse] = await Promise.all([
      fetchFromGroq(promptForCode),
      fetchFromGroq(promptForExplanation),
    ]);

    setSolution(codeResponse);
    setExplanation(explanationResponse);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <button onClick={getSolution}>Get Python Solution</button>

      {solution && (
        <div style={{ overflowX: "auto", maxWidth: "100%", marginTop: "10px" }}>
          <button onClick={copyToClipboard} style={{ marginBottom: "5px" }}>
            {copied ? "Copied!" : "Copy Code"}
          </button>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
            {solution}
          </pre>

          {explanation && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowExplanation(!showExplanation)}>
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </button>
              {showExplanation && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

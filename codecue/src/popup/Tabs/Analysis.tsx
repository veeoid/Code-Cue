// File: src/popup/Tabs/Analysis.tsx
import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

interface AnalysisProps {
  question: string;
}

export default function Analysis({ question }: AnalysisProps) {
  const [correctness, setCorrectness] = useState("");
  const [improvements, setImprovements] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);
    setShowReport(false);

    chrome.storage.local.get(["leetcodeUserCode"], async (result) => {
      const latestCode = result.leetcodeUserCode || "";

      const cleanedCode = latestCode
        .replace(/^```python/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .replace(/\\n/g, "\n")
        .replace(/\r/g, "")
        .trim();

      try {
        const prompt = `
        Question:
${question}

You are a LeetCode assistant. Given the question and user's Python code, follow these rules:

DO NOT PROVIDE COMPLETE CODE TO ME WHATEVER ME BE THE REASON.
0. IF WITH CURRENT LOGIC OF THE CODE, if we can solve the given question then go to line 3 and ignore other lines.
1. First, check if the code will run . If there are syntax or runtime issues, point them out clearly with **Bug (Line X):** and suggest a fix in **Fix (Line X):** format.
2. If the code runs but is logically incorrect for the given problem, point out the logic errors with the same **Bug (Line X):** and **Fix (Line X):** style. Only mention relevant lines with problems and explain the bug briefly.
3. If the code is logically correct and works as expected, say so and praise the user in one sentence like "🎉 Great job, your solution is clean and correct!".
4. Only suggest improvements if they impact time or space complexity. Be very brief and use a separate "Suggested Improvements:" section.
5. Do **not** suggest things like renaming variables, adding comments, or docstrings. This is for LeetCode submissions.
6. Do **not** suggest alternate full implementations.
7. Never say the code is incomplete if it contains valid logic for solving the problem.
8. Use only the lines and structure from user's original code to judge correctness.

Code:
${cleanedCode}
        
`;
        console.log("Here's the cleaned code:");
        console.log(cleanedCode[500]);
        const response = await fetchFromGroq(prompt);
        const [correctnessPart, ...improvementParts] = response
          .trim()
          .split("Suggested Improvements:");
        setCorrectness(correctnessPart.trim());
        setImprovements(
          improvementParts.join("Suggested Improvements:").trim()
        );
      } catch (err) {
        setCorrectness("❌ Error analyzing code.");
      } finally {
        setLoading(false);
        setShowReport(true);
      }
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h3>Analyze My Code 🧠</h3>

      <button
        onClick={analyzeCode}
        style={{
          padding: "8px 14px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🔍 Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {showReport && (
        <>
          <div style={{ marginTop: "15px" }}>
            <h4>Correctness Report:</h4>
            <div
              style={{
                background: "#e3f2fd",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
              }}
            >
              {correctness}
            </div>
          </div>

          {improvements && improvements !== correctness && (
            <div style={{ marginTop: "15px" }}>
              <h4>Suggested Improvements:</h4>
              <div
                style={{
                  background: "#f3e5f5",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {improvements}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

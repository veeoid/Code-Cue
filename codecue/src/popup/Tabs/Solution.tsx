// File: src/popup/Tabs/Solution.tsx

import { useState } from "react";

interface SolutionProps {
  response: string;
}

export default function Solution({ response }: SolutionProps) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const extractParts = (response: string) => {
    const parts = response.split("```");
    const cleanedParts = parts.map((p: string) => p.replace(/```/g, "").trim());

    let codeBlock =
      cleanedParts.find((p: string) => p.includes("class Solution")) || "";
    if (!codeBlock) {
      const rawDef = cleanedParts.find((p: string) => p.includes("def ")) || "";
      if (rawDef) {
        const indented = rawDef
          .split("\n")
          .map((line) => (line.trim() !== "" ? "    " + line : ""))
          .join("\n");
        codeBlock = `class Solution:\n${indented}`;
      }
    }

    codeBlock = codeBlock.replace(/^python\n?/i, "");

    const explanationPart = cleanedParts.find(
      (p: string) =>
        !p.includes("class Solution") &&
        !p.includes("def ") &&
        !/^python\b|\bpython solution\b/i.test(p.trim()) &&
        p.length > 40
    );

    return {
      code: codeBlock.trim(),
      explanation: explanationPart?.trim() || "",
    };
  };

  const { code, explanation } = extractParts(response);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {code && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <strong>Python Code:</strong>
            <button
              onClick={handleCopy}
              style={{
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              📋 {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "8px",
              overflowX: "auto",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      )}

      {explanation && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => setShowExplanation((prev) => !prev)}
            style={{
              background: "#eee",
              border: "1px solid #ccc",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>
          {showExplanation && (
            <div
              style={{
                background: "#fdfdfd",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "10px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                whiteSpace: "pre-line",
              }}
            >
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

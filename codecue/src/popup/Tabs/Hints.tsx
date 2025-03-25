import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

export default function Hints({ question }: { question: string }) {
  const [hints, setHints] = useState<string[]>(["", "", ""]);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([false, false, false]);

  const getHint = async (level: number) => {
    if (hints[level]) {
      // Toggle reveal state if hint already exists
      setRevealedHints(prev => {
        const newState = [...prev];
        newState[level] = !newState[level];
        return newState;
      });
      return;
    }

    const prompts = [
      `Respond with only a very subtle, basic one-line hint to help solve the following LeetCode question. Do NOT add any introduction or extra commentary. Hint: suggest the type of thinking or data structure to consider.\n\nQuestion: ${question}`,
      `Respond with only a slightly more revealing one-liner than the previous hint for the following LeetCode problem. Do NOT include any extra intro. Hint should gently point toward the method without giving away the full solution.\n\nQuestion: ${question}`,
      `Respond with a one-liner or two-line final hint that directly suggests the solving approach or technique. Do NOT include any preface or commentary.\n\nQuestion: ${question}`,
    ];

    const response = await fetchFromGroq(prompts[level]);
    setHints((prev) => {
      const newHints = [...prev];
      newHints[level] = response;
      return newHints;
    });
    // Reveal the hint after fetching
    setRevealedHints(prev => {
      const newState = [...prev];
      newState[level] = true;
      return newState;
    });
  };

  return (
    <div className="hints-container">
      {[0, 1, 2].map((i) => (
        <div key={i} className="hint-item">
          <button 
            className={`hint-button ${hints[i] && revealedHints[i] ? 'revealed' : ''}`}
            onClick={() => getHint(i)}
          >
            <span>Hint {i + 1}</span>
            {hints[i] && (
              <svg
                className={`chevron-icon ${revealedHints[i] ? 'revealed' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </button>
          {hints[i] && (
            <div className={`hint-content ${revealedHints[i] ? 'revealed' : ''}`}>
              <p className="hint-text">{hints[i]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

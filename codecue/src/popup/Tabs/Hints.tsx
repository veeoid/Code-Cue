import { useState } from "react";
import { fetchFromGroq } from "../../api/groqClient";

export default function Hints({ question }: { question: string }) {
  const [hints, setHints] = useState<string[]>(["", "", ""]);

  const getHint = async (level: number) => {
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
  };

  return (
    <div>
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <button onClick={() => getHint(i)}>Hint {i + 1}</button>
          {hints[i] && <p>{hints[i]}</p>}
        </div>
      ))}
    </div>
  );
}

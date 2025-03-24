// File: src/popup/App.tsx
import { useEffect, useState } from "react";
import Hints from "./popup/Tabs/Hints";
import Summary from "./popup/Tabs/Summary";
import Solution from "./popup/Tabs/Solution";

export default function App() {
  const [tab, setTab] = useState("hints");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    chrome.storage.local.get("leetcodeQuestion", (result) => {
      if (result.leetcodeQuestion) {
        setQuestion(result.leetcodeQuestion);
      }
    });
  }, []);

  return (
    <div style={{ padding: "10px", width: "300px" }}>
      <textarea
        placeholder="Paste LeetCode question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />
      <div>
        <button onClick={() => setTab("hints")}>Hints</button>
        <button onClick={() => setTab("summary")}>Summary</button>
        <button onClick={() => setTab("solution")}>Solution</button>
      </div>
      <div>
        {tab === "hints" && <Hints question={question} />}
        {tab === "summary" && <Summary question={question} />}
        {tab === "solution" && <Solution question={question} />}
      </div>
    </div>
  );
}

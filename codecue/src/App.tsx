// File: src/popup/App.tsx
import { useEffect, useState } from "react";
import Hints from "./popup/Tabs/Hints";
import Summary from "./popup/Tabs/Summary";
import Solution from "./popup/Tabs/Solution";

export default function App() {
  const [tab, setTab] = useState("hints");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    // Load from local storage
    chrome.storage.local.get("leetcodeQuestion", (result) => {
      if (result.leetcodeQuestion) {
        setQuestion(result.leetcodeQuestion);
      }
    });

    // Listen for real-time updates
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "LEETCODE_QUESTION") {
        console.log("📥 Popup received updated question:", message.payload);
        setQuestion(message.payload);
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
      <div style={{ margin: "10px 0" }}>
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

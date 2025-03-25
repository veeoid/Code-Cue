// File: src/popup/App.tsx
import { useEffect, useState } from "react";
import Hints from "./popup/Tabs/Hints";
import Summary from "./popup/Tabs/Summary";
import Solution from "./popup/Tabs/Solution";
import "./App.css";

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
    <div className="app-container">
      <div className="textarea-container">
        <textarea
          className="question-textarea"
          placeholder="Paste LeetCode question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${tab === "hints" ? "active" : ""}`}
          onClick={() => setTab("hints")}
        >
          Hints
        </button>
        <button 
          className={`tab-button ${tab === "summary" ? "active" : ""}`}
          onClick={() => setTab("summary")}
        >
          Summary
        </button>
        <button 
          className={`tab-button ${tab === "solution" ? "active" : ""}`}
          onClick={() => setTab("solution")}
        >
          Solution
        </button>
      </div>

      <div className="content-section">
        {tab === "hints" && <Hints question={question} />}
        {tab === "summary" && <Summary question={question} />}
        {tab === "solution" && <Solution question={question} />}
      </div>
    </div>
  );
}

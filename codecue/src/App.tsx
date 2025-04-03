// File: src/App.tsx

import { useEffect, useState } from "react";
import Hints from "./popup/Tabs/Hints";
import Summary from "./popup/Tabs/Summary";
import Solution from "./popup/Tabs/Solution";
import Analysis from "./popup/Tabs/Analysis";
import { fetchFromGroq } from "./api/groqClient";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("hints");
  const [question, setQuestion] = useState("");
  const [pseudocode, setPseudocode] = useState("");
  const [solution, setSolution] = useState("");

  useEffect(() => {
    chrome.storage.local.get(
      ["leetcodeQuestion", "leetcodeUserCode"],
      (result) => {
        if (result.leetcodeQuestion) {
          setQuestion(result.leetcodeQuestion);
        }
      }
    );

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "LEETCODE_QUESTION") {
        setQuestion(message.payload);
        setPseudocode("");
        setSolution("");
      }
    });
  }, []);

  const fetchPseudocode = async () => {
    if (!pseudocode && question) {
      const prompt = `Explain the algorithm to solve the following LeetCode question in a brief and structured format. Use bullet points or step-wise format. Avoid unnecessary introductions or commentary. Use simple language.\n\nQuestion:\n${question}`;
      const response = await fetchFromGroq(prompt);
      setPseudocode(response);
    }
  };

  const fetchSolution = async () => {
    if (!solution && question) {
      const prompt = `Give me a Python solution for the following LeetCode problem with explanation: ${question}`;
      const response = await fetchFromGroq(prompt);
      setSolution(response);
    }
  };

  const handleTabSwitch = (nextTab: string) => {
    setTab(nextTab);
    if (nextTab === "summary") fetchPseudocode();
    if (nextTab === "solution") fetchSolution();
  };

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
          onClick={() => handleTabSwitch("hints")}
        >
          Hints
        </button>
        <button
          className={`tab-button ${tab === "summary" ? "active" : ""}`}
          onClick={() => handleTabSwitch("summary")}
        >
          Give me Pseudocode
        </button>
        <button
          className={`tab-button ${tab === "solution" ? "active" : ""}`}
          onClick={() => handleTabSwitch("solution")}
        >
          Solution
        </button>
        <button
          className={`tab-button ${tab === "analysis" ? "active" : ""}`}
          onClick={() => handleTabSwitch("analysis")}
        >
          Analyze My Code
        </button>
      </div>

      <div className="content-section">
        {tab === "hints" && <Hints question={question} />}
        {tab === "summary" && <Summary response={pseudocode} />}
        {tab === "solution" && <Solution response={solution} />}
        {tab === "analysis" && <Analysis question={question} />}

        {/* ✅ Pass extracted user code */}
      </div>
    </div>
  );
}

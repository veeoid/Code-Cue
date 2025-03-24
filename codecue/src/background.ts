// File: src/background.ts
/// <reference types="chrome" />

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "LEETCODE_QUESTION") {
      chrome.storage.local.set({ leetcodeQuestion: message.payload });
    }
  });
  
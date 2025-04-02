// File: src/background.ts
/// <reference types="chrome" />

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "LEETCODE_QUESTION") {
    chrome.storage.local.set({ leetcodeQuestion: message.payload });
  }

  // NEW: Store extracted user code
  if (message.type === "LEETCODE_USER_CODE") {
    chrome.storage.local.set({ leetcodeUserCode: message.payload });
  }
});

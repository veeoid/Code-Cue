// File: src/content.ts

async function extractLeetCodeQuestionWithRetries(retries = 5, delay = 1000): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const titleElement =
      document.querySelector("h1") ||
      document.querySelector("[data-cy='question-title']") ||
      document.querySelector("div[class*='title']") ||
      document.querySelector("title");

    const descElement =
      document.querySelector(".question-content__JfgR") ||
      document.querySelector(".content__u3I1") ||
      document.querySelector("div[data-key='description']") ||
      document.querySelector(".elfjS") || // fallback selector for latest LeetCode DOM
      document.querySelector("div[class*='description']") ||
      document.querySelector("div[class*='question']");

    let title = titleElement?.textContent?.trim() || "";
    if (title.includes(" - LeetCode")) {
      title = title.replace(" - LeetCode", "").trim();
    }

    const desc = descElement instanceof HTMLElement ? descElement.innerText.trim() : "";

    console.log("🔍 Extracting title and description:", {
      titleElement,
      descElement,
      titleText: title,
      descInnerText: desc,
    });

    if (title && desc) {
      return `${title}\n\n${desc}`.trim();
    }

    await new Promise((res) => setTimeout(res, delay)); // wait before retry
  }

  return null;
}

let lastUrl = location.href;
let lastQuestion = "";

function trySendQuestion() {
  extractLeetCodeQuestionWithRetries().then((question) => {
    if (question && question !== lastQuestion) {
      console.log("📨 Sending new question from content script");
      lastQuestion = question;
      chrome.runtime.sendMessage({
        type: "LEETCODE_QUESTION",
        payload: question,
      });
    } else if (!question) {
      console.warn("❌ Could not extract LeetCode question after retries.");
    }
  });
}

// Initial run
trySendQuestion();

// Detect URL changes (SPA navigation)
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(() => {
      trySendQuestion();
    }, 2000);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

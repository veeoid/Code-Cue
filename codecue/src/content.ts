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

async function tryExtractUserCode(retries = 8, delay = 2000): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    // ✅ Scroll the editor into view to force Monaco to render hidden lines
    const editor = document.querySelector(".monaco-editor") as HTMLElement;
    if (editor) {
      editor.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const lineElements = document.querySelectorAll(".view-line");

    const codeLines: string[] = [];
    lineElements.forEach((line) => {
      const text = (line as HTMLElement).textContent || "";
      codeLines.push(text);
    });

    const fullCode = codeLines.join("\n").trim();

    const hasReturn = codeLines.some((line) => line.includes("return"));
    const endsWithWhile = codeLines[codeLines.length - 1]?.trim() === "while True:";
    const lineCount = codeLines.length;

    console.log(`🔍 Attempt ${attempt + 1}: lineCount = ${lineCount}, hasReturn = ${hasReturn}, endsWithWhile = ${endsWithWhile}`);

    const isCodeReady =
      fullCode.length > 0 &&
      (lineCount >= 10 && (hasReturn || !endsWithWhile) || lineCount >= 15);

    if (isCodeReady) {
      console.log("✅ Extracted user code:\n", fullCode);

      if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: "LEETCODE_USER_CODE",
          payload: fullCode,
        });
      } else {
        console.warn("⚠️ chrome.runtime.sendMessage is not available");
      }

      return;
    }

    console.warn(
      `⏳ Code not ready (attempt ${attempt + 1}). Retrying in ${delay / 1000}s...`
    );
    await new Promise((res) => setTimeout(res, delay));
  }

  console.error("❌ Failed to extract complete user code after retries.");
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
tryExtractUserCode(); // ✅ Also try grabbing code on page load

// Detect URL changes (SPA navigation)
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(() => {
      trySendQuestion();
      tryExtractUserCode(); // ✅ Recheck user code too
    }, 2000);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

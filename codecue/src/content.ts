function extractLeetCodeQuestion(): string | null {
    const titleElement = document.querySelector("h1");
    const descElement = document.querySelector(".content__u3I1.question-content__JfgR");
  
    const title = titleElement?.textContent?.trim() || "";
    const desc = descElement ? (descElement as HTMLElement).innerText.trim() : "";
  
    const fullQuestion = `${title}\n\n${desc}`;
    return fullQuestion.trim() || null;
  }
  
  setTimeout(() => {
    const question = extractLeetCodeQuestion();
    if (question) {
      chrome.runtime.sendMessage({
        type: "LEETCODE_QUESTION",
        payload: question
      });
    }
  }, 2000);
  
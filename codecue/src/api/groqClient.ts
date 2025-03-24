export async function fetchFromGroq(prompt: string) {
    try {
      const res = await fetch("http://localhost:3000/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
  
      if (!res.ok) throw new Error(`Status: ${res.status}`);
  
      const data = await res.json();
      return data.result || "No response from proxy server.";
    } catch (error) {
      console.error("Client fetch failed:", error);
      return "⚠️ Failed to fetch response from proxy server.";
    }
  }
  
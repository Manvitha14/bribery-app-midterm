import { decryptToken } from '../authUtils';
export async function fetchMessageHistory(senderId, receiverId, lastEvaluatedKey = null, limit = 10) {
  try {
    const jwtToken = sessionStorage.getItem('jwt');  
    const token = decryptToken(jwtToken);
    
    console.log("Fetching message history:", { senderId, receiverId, lastEvaluatedKey, limit });

    const response = await fetch("https://8jtaj9psal.execute-api.eu-west-1.amazonaws.com/Dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId, receiverId, lastEvaluatedKey, limit }),
    });

    console.log("API response status:", response.status);

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error("Failed to fetch message history.");
    }

    const responseBody = await response.json();
    console.log("API response body:", responseBody);

    const data = JSON.parse(responseBody.body || "{}");
    console.log("Parsed data:", data);

    const messages = (data.messages || []).map((msg) => ({
      ...msg,
      timestamp: new Date(new Date(msg.timestamp).getTime() + 5.5 * 60 * 60 * 1000).toISOString(), // Adjust to IST
    }));
    console.log("Formatted messages:", messages);

    return { messages, lastEvaluatedKey: data.lastEvaluatedKey || null };
  } catch (error) {
    console.error("Error in fetchMessageHistory:", error);
    return { messages: [], lastEvaluatedKey: null };
  }
}
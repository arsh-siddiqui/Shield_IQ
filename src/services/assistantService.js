import apiClient, { isBackendUnreachable } from "./apiClient";

export async function askAssistantRemote({ message, conversationHistory = [], scanContext = null }) {
  try {
    // Backend route is /api/assistant/chat (not /ask)
    const { data } = await apiClient.post("/assistant/chat", {
      message,
      conversationHistory,
      scanContext,
    });
    return data.data;
  } catch (err) {
    if (isBackendUnreachable(err)) {
      return {
        message: "DetectIQ Assistant is currently offline. Please ensure the backend server is running.",
        model: "offline-fallback",
        timestamp: new Date().toISOString(),
        fallback: true,
      };
    }

    const errorMsg = err.response?.data?.message || "DetectIQ Assistant is temporarily unavailable. Please try again later.";
    return {
      message: errorMsg,
      model: "fallback",
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
}

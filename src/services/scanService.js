import apiClient from "./apiClient";

/**
 * Calls the real /api/scan endpoint. Callers (AIScanner.jsx) fall back to
 * the local scanEngine.js heuristic when this throws — see
 * isBackendUnreachable in apiClient.js.
 */
export async function analyzeContentRemote(content, scanType) {
  const { data } = await apiClient.post("/scan", { content, scanType });
  return data.data.result;
}

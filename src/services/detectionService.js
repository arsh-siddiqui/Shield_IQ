import apiClient from "./apiClient";

export async function submitScan(content, scanType) {
  // Returns { result, savedToHistory, scanId, scan }
  const { data } = await apiClient.post("/scan", { content, scanType });
  return data.data;
}

export async function getScanHistory() {
  const { data } = await apiClient.get("/users/scans");
  return data.data.scans;
}

export async function getScanResult(scanId) {
  // Returns the Scan document
  const { data } = await apiClient.get(`/users/scans/${scanId}`);
  return data.data;
}

import apiClient from "./apiClient";

export async function submitScan(content, scanType) {
  const { data } = await apiClient.post("/scan/analyze", { content, scanType });
  return data.data;
}

export async function getScanHistory() {
  const { data } = await apiClient.get("/users/scans");
  return data.data.scans;
}

export async function getScanResult(scanId) {
  const { data } = await apiClient.get(`/users/scans/${scanId}`);
  return data.data;
}

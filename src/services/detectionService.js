import apiClient from "./apiClient";

export async function submitScan(content, scanType, inputType = null) {
  // Returns { result, savedToHistory, scanId, scan }
  const payload = { content, scanType };
  if (inputType) payload.inputType = inputType;
  const { data } = await apiClient.post("/scan", payload);
  return data.data;
}

export async function getScanHistory() {
  const { data } = await apiClient.get("/users/scans");
  return data.data.scans;
}

export const personalizeScan = async (scanId) => {
  const response = await apiClient.post(`/users/scans/${scanId}/personalize`);
  return response.data;
};

export async function getScanResult(scanId) {
  // Returns the Scan document
  const { data } = await apiClient.get(`/users/scans/${scanId}`);
  return data.data;
}

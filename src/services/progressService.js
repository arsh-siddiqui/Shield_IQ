import apiClient from "./apiClient";

export async function getAllProgress() {
  const { data } = await apiClient.get("/progress");
  return data.data;
}

export async function getProgress(vulnerabilityId) {
  const { data } = await apiClient.get(`/progress/${vulnerabilityId}`);
  return data.data;
}

export async function completeTheory(vulnerabilityId) {
  const { data } = await apiClient.post(`/progress/${vulnerabilityId}/theory`);
  return data.data;
}

export async function completeLab(vulnerabilityId) {
  const { data } = await apiClient.post(`/progress/${vulnerabilityId}/lab`);
  return data.data;
}

export async function submitAssessment(vulnerabilityId, answers) {
  const { data } = await apiClient.post(`/progress/${vulnerabilityId}/assessment`, { answers });
  return data.data;
}

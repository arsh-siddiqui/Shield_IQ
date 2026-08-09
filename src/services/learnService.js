import apiClient from "./apiClient";

export async function getTopics() {
  const { data } = await apiClient.get("/learn/topics");
  return data.data.topics;
}

export async function getLessons(topic) {
  const { data } = await apiClient.get("/learn/lessons", { params: { topic } });
  return data.data.lessons;
}

export async function getLessonById(id) {
  const { data } = await apiClient.get(`/learn/lessons/${id}`);
  return data.data.lesson;
}

export async function getLessonProgress(id) {
  const { data } = await apiClient.get(`/learn/lessons/${id}/progress`);
  return data.data.progress;
}

export async function updateLessonProgress(id, payload) {
  const { data } = await apiClient.put(`/learn/lessons/${id}/progress`, payload);
  return data.data.progress;
}

export async function completeLessonRemote(id) {
  const { data } = await apiClient.post(`/learn/lessons/${id}/complete`);
  return data.data.progress;
}

export async function getQuickLearns() {
  const { data } = await apiClient.get("/learn/quick-learns");
  return data.data.quickLearns;
}

export async function getSafetyTips() {
  const { data } = await apiClient.get("/learn/safety-tips");
  return data.data.safetyTips;
}

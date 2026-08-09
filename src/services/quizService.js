import apiClient from "./apiClient";

export async function fetchQuizzes(params = {}) {
  const { data } = await apiClient.get("/quizzes", { params });
  return data.data.quizzes;
}

export async function submitQuizRemote(quizId, optionId) {
  const { data } = await apiClient.post(`/quizzes/${quizId}/submit`, { optionId });
  return data.data; // { result, correct, xpAwarded, xpTotal }
}

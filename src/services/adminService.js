import apiClient from "./apiClient";

export async function fetchAdminStats() {
  const { data } = await apiClient.get("/admin/stats");
  return data.data;
}

export async function fetchAdminAnalytics() {
  const { data } = await apiClient.get("/admin/analytics");
  return data.data;
}

export async function fetchAdminUsers(params = {}) {
  const { data } = await apiClient.get("/admin/users", { params });
  return data.data.users;
}

export async function updateAdminUserRemote(id, patch) {
  const { data } = await apiClient.put(`/admin/users/${id}`, patch);
  return data.data.user;
}

export async function deleteAdminUserRemote(id) {
  await apiClient.delete(`/admin/users/${id}`);
}

export async function fetchAdminLessons() {
  const { data } = await apiClient.get("/admin/lessons");
  return data.data.lessons;
}

export async function createAdminLesson(lessonData) {
  const { data } = await apiClient.post("/admin/lessons", lessonData);
  return data.data.lesson;
}

export async function updateAdminLesson(id, lessonData) {
  const { data } = await apiClient.put(`/admin/lessons/${id}`, lessonData);
  return data.data.lesson;
}

export async function deleteAdminLesson(id) {
  await apiClient.delete(`/admin/lessons/${id}`);
}

export async function toggleAdminLessonPublish(id, publish) {
  const { data } = await apiClient.patch(`/admin/lessons/${id}/publish`, { publish });
  return data.data.lesson;
}

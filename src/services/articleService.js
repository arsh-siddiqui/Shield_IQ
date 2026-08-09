import apiClient from "./apiClient";

export async function fetchArticles(params = {}) {
  const { data } = await apiClient.get("/articles", { params });
  return data.data.articles;
}

export async function fetchArticleById(id) {
  const { data } = await apiClient.get(`/articles/${id}`);
  return data.data.article;
}

export async function createArticleRemote(payload) {
  const { data } = await apiClient.post("/articles", payload);
  return data.data.article;
}

export async function updateArticleRemote(id, patch) {
  const { data } = await apiClient.put(`/articles/${id}`, patch);
  return data.data.article;
}

export async function deleteArticleRemote(id) {
  await apiClient.delete(`/articles/${id}`);
}

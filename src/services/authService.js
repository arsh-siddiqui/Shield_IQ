import apiClient from "./apiClient";

export async function registerUser({ name, email, password, accountRole }) {
  const { data } = await apiClient.post("/auth/register", { name, email, password, accountRole });
  return data.data.user;
}

export async function loginUser({ email, password }) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data.user;
}

export async function logoutUser() {
  await apiClient.post("/auth/logout");
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("/auth/me");
  return data.data.user;
}

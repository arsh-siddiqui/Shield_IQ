import apiClient from "./apiClient";

export async function getEmailHistory() {
  const { data } = await apiClient.get("/email-history");
  return data.data;
}

export async function getEmailHistoryById(id) {
  const { data } = await apiClient.get(`/email-history/${id}`);
  return data.data;
}

export async function addEmailHistory(emailData) {
  const { data } = await apiClient.post("/email-history", emailData);
  return data.data;
}

export async function deleteEmailHistory(id) {
  const { data } = await apiClient.delete(`/email-history/${id}`);
  return data.data;
}

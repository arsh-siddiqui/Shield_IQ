import apiClient from "./apiClient";

export async function getEmailHistory() {
  // backend returns { emails: [...] }
  const { data } = await apiClient.get("/email-history");
  return data.emails || data.data || [];
}

export async function getEmailHistoryById(id) {
  const { data } = await apiClient.get(`/email-history/${id}`);
  return data.email || data.data;
}

export async function addEmailHistory(emailData) {
  // backend returns the result from emailHistoryService directly
  const { data } = await apiClient.post("/email-history", emailData);
  return data;
}

export async function deleteEmailHistory(id) {
  const { data } = await apiClient.delete(`/email-history/${id}`);
  return data;
}


import api from './apiClient';

export const askInvestigationCopilot = async (investigationId, question) => {
  const response = await api.post(`/security/investigations/${investigationId}/copilot`, { question });
  return response.data;
};

export const generateInvestigationReport = async (investigationId) => {
  const response = await api.post(`/security/investigations/${investigationId}/report`);
  return response.data;
};

export const getInvestigationReport = async (investigationId) => {
  const response = await api.get(`/security/investigations/${investigationId}/report`);
  return response.data;
};

import apiClient from "./apiClient";

export async function fetchSimulations() {
  const { data } = await apiClient.get("/simulations");
  return data.data.simulations;
}

export async function submitSimulationRemote(simulationId, choice) {
  const { data } = await apiClient.post(`/simulations/${simulationId}/submit`, { choice });
  return data.data; // { result, feedback, lessonsLearned, xpTotal }
}

export async function createSimulationRemote(payload) {
  const { data } = await apiClient.post("/simulations", payload);
  return data.data.simulation;
}

export async function updateSimulationRemote(id, patch) {
  const { data } = await apiClient.put(`/simulations/${id}`, patch);
  return data.data.simulation;
}

export async function deleteSimulationRemote(id) {
  await apiClient.delete(`/simulations/${id}`);
}

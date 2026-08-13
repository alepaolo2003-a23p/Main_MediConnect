import { apiFetch, handleResponse } from "./apiClient";

export async function createNotaRequest({ cita_id, paciente_id, motivo_consulta, diagnostico, tratamiento, observaciones }) {
  const res = await apiFetch("/historia-clinica", {
    method: "POST",
    body: JSON.stringify({ cita_id, paciente_id, motivo_consulta, diagnostico, tratamiento, observaciones }),
  });
  const data = await handleResponse(res);
  return data.nota;
}

export async function getHistorialPacienteRequest(pacienteId) {
  const res = await apiFetch(`/historia-clinica/paciente/${pacienteId}`);
  const data = await handleResponse(res);
  return data.historial;
}

export async function getMisNotasRequest() {
  const res = await apiFetch("/historia-clinica/mis-notas");
  const data = await handleResponse(res);
  return data.notas;
}

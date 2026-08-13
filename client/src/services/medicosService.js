import { apiFetch, handleResponse } from "./apiClient";

export async function getMedicosRequest({ especialidad, active } = {}) {
  const params = new URLSearchParams();
  if (especialidad) params.set("especialidad", especialidad);
  if (typeof active === "boolean") params.set("active", String(active));
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await apiFetch(`/medicos${query}`);
  const data = await handleResponse(res);
  return data.medicos;
}

export async function getMedicoRequest(id) {
  const res = await apiFetch(`/medicos/${id}`);
  const data = await handleResponse(res);
  return data.medico;
}

export async function registrarMedicoRequest(formValues, fotoFile) {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  if (fotoFile) formData.append("foto", fotoFile);

  const res = await apiFetch("/medicos/registrar", { method: "POST", body: formData });
  const data = await handleResponse(res);
  return data.medico;
}

export async function configurarHorarioRequest({ medico_id, dias, duracion_cita }) {
  const res = await apiFetch("/medicos/horario", {
    method: "POST",
    body: JSON.stringify({ medico_id, dias, duracion_cita }),
  });
  const data = await handleResponse(res);
  return data.horario;
}

export async function getHorarioRequest(medicoId) {
  const res = await apiFetch(`/medicos/horario/${medicoId}`);
  const data = await handleResponse(res);
  return data.horario;
}

export async function bloquearFechaRequest({ medico_id, fecha_inicio, fecha_fin, motivo }) {
  const res = await apiFetch("/medicos/bloqueo", {
    method: "POST",
    body: JSON.stringify({ medico_id, fecha_inicio, fecha_fin, motivo }),
  });
  const data = await handleResponse(res);
  return data.bloqueo;
}

export async function getBloqueosRequest(medicoId) {
  const res = await apiFetch(`/medicos/bloqueos/${medicoId}`);
  const data = await handleResponse(res);
  return data.bloqueos;
}

export async function deleteBloqueoRequest(id) {
  const res = await apiFetch(`/medicos/bloqueo/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

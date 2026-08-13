import { apiFetch, handleResponse } from "./apiClient";

export async function reservarCitaRequest({ medico_id, fecha, hora, motivo_consulta }) {
  const res = await apiFetch("/citas", {
    method: "POST",
    body: JSON.stringify({ medico_id, fecha, hora, motivo_consulta }),
  });
  const data = await handleResponse(res);
  // devolver msg y cita para que el frontend pueda mostrar advertencias (fuera_rango) o si es adicional
  return { msg: data.msg, cita: data.cita };
}

export async function getCitasMedicoRequest(medicoId, { desde, hasta } = {}) {
  const params = new URLSearchParams();
  if (desde) params.set("desde", desde);
  if (hasta) params.set("hasta", hasta);
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await apiFetch(`/citas/medico/${medicoId}${query}`);
  const data = await handleResponse(res);
  return data.citas;
}

export async function getCitasPacienteRequest(pacienteId) {
  const res = await apiFetch(`/citas/paciente/${pacienteId}`);
  const data = await handleResponse(res);
  return data.citas;
}

// estado: "confirmada" | "atendida" | "no_asistio"
export async function actualizarEstadoCitaRequest(id, estado) {
  const res = await apiFetch(`/citas/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
  const data = await handleResponse(res);
  return data.cita;
}

export async function cancelarCitaRequest(id) {
  const res = await apiFetch(`/citas/${id}/cancelar`, { method: "PUT" });
  const data = await handleResponse(res);
  return data.cita;
}

import { apiFetch, handleResponse } from "./apiClient";

export async function getClinicasRequest({ active } = {}) {
  const params = new URLSearchParams();
  if (typeof active === "boolean") params.set("active", String(active));
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await apiFetch(`/clinicas${query}`);
  const data = await handleResponse(res);
  return data.clinicas;
}

export async function getClinicaRequest(id) {
  const res = await apiFetch(`/clinicas/${id}`);
  const data = await handleResponse(res);
  return data.clinica;
}

export async function createClinicaRequest(formValues) {
  const res = await apiFetch("/clinicas", {
    method: "POST",
    body: JSON.stringify(formValues),
  });
  const data = await handleResponse(res);
  return data.clinica;
}

export async function updateClinicaRequest(id, formValues) {
  const res = await apiFetch(`/clinicas/${id}`, {
    method: "PUT",
    body: JSON.stringify(formValues),
  });
  const data = await handleResponse(res);
  return data.clinica;
}

export async function deleteClinicaRequest(id) {
  const res = await apiFetch(`/clinicas/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

import { apiFetch, handleResponse, API_URL } from "./apiClient";

// La API sirve /uploads como estático desde la raíz del servidor (no bajo /api/v1)
export const FILES_BASE_URL = API_URL.replace(/\/api\/v\d+$/, "");

export async function getMeRequest() {
  const res = await apiFetch("/user/me");
  const data = await handleResponse(res);
  return data.response;
}

export async function getUsersRequest({ rol, active } = {}) {
  const params = new URLSearchParams();
  if (rol) params.set("rol", rol);
  if (typeof active === "boolean") params.set("active", String(active));
  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await apiFetch(`/users${query}`);
  const data = await handleResponse(res);
  return data.response;
}

export async function createUserRequest(formValues, fotoFile) {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  if (fotoFile) formData.append("foto", fotoFile);

  const res = await apiFetch("/user", { method: "POST", body: formData });
  const data = await handleResponse(res);
  return data.user;
}

export async function updateUserRequest(id, formValues, fotoFile) {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  if (fotoFile) formData.append("foto", fotoFile);

  const res = await apiFetch(`/users/${id}`, { method: "PUT", body: formData });
  const data = await handleResponse(res);
  return data.user;
}

export async function deleteUserRequest(id) {
  const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

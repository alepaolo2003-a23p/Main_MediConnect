import { API_URL, handleResponse } from "./apiClient";

export async function loginRequest(correo, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });
  return handleResponse(res);
}

export async function registerRequest(formValues) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formValues),
  });
  return handleResponse(res);
}

export async function refreshAccessTokenRequest(token) {
  const res = await fetch(`${API_URL}/auth/refresh_access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return handleResponse(res);
}

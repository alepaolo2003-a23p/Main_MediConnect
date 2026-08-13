const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3977/api/v1";

export { API_URL };

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No hay refresh token");

  const res = await fetch(`${API_URL}/auth/refresh_access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!res.ok) throw new Error("No se pudo renovar la sesión");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  // Notificar a otros listeners (p. ej. AuthProvider o sockets) que el token se renovó
  try {
    window.dispatchEvent(new CustomEvent("accessTokenRefreshed", { detail: { token: data.accessToken } }));
  } catch (e) {
    // noop en entornos sin window
  }
  return data.accessToken;
}

/**
 * Wrapper de fetch que:
 * - agrega el Bearer token automáticamente
 * - si recibe 401, intenta refrescar el token y reintenta la petición una vez
 */
export async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const doFetch = (token) => {
    const isFormData = options.body instanceof FormData;
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  let response = await doFetch(accessToken);

  if (response.status === 401 && localStorage.getItem("refreshToken")) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newToken);
        response = await doFetch(newToken);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("mc_user");
        window.location.href = "/login";
        throw err;
      }
    } else {
      response = await new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          resolve(doFetch(newToken));
        });
      });
    }
  }

  return response;
}

export async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(data?.msg || "Error en la solicitud");
  }
  return data;
}

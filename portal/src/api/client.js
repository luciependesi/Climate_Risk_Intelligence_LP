// src/api/client.js
// A simple API client with built-in token management and toast integration.
// src/api/client.js
// src/api/client.js

const API_URL = import.meta.env.VITE_API_URL;

// --- token storage ---

let accessToken = null;
let refreshToken = null;

export function setAuthToken(token, refresh = null) {
  accessToken = token;
  refreshToken = refresh ?? refreshToken;

  localStorage.setItem("auth_token", token);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function loadTokensFromStorage() {
  accessToken = localStorage.getItem("auth_token");
  refreshToken = localStorage.getItem("refresh_token");
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
}

// --- toast integration ---

let toastHandler = null;

export function registerToastHandler(fn) {
  toastHandler = fn; // (message, type) => void
}

function showToast(message, type = "error") {
  if (toastHandler) toastHandler(message, type);
}

// --- low-level request helper ---

async function request(path, options = {}, { skipAuth = false } = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (!skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // happy path
  if (res.ok) {
    if (res.status === 204) return null;
    return res.json();
  }

  // handle 401 with refresh
  if (res.status === 401 && !skipAuth && refreshToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request(path, options, { skipAuth: false });
    }
  }

  // error path
  let detail = `Request to ${path} failed with ${res.status}`;
  try {
    const data = await res.json();
    if (data?.detail) detail = data.detail;
  } catch (_) {}

  showToast(detail, "error");
  throw new Error(detail);
}

async function tryRefreshToken() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      showToast("Session expired. Please log in again.", "error");
      return false;
    }

    const data = await res.json();
    setAuthToken(data.access_token, data.refresh_token ?? refreshToken);
    return true;

  } catch (err) {
    clearTokens();
    showToast("Failed to refresh session.", "error");
    return false;
  }
}

// --- public helpers ---

export function apiGet(path) {
  return request(path, { method: "GET" });
}

export function apiPost(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete(path) {
  return request(path, { method: "DELETE" });
}

// --- high-level API wrapper (used by Login.jsx) ---

export const api = {
  async login(email, password) {
    return apiPost("/auth/login", { email, password });
  },
};
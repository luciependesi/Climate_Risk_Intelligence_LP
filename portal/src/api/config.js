// src/api/config.js
export const API_BASE = "http://127.0.0.1:8000";

let useMock = false; // ← default to LIVE now

export function setUseMock(value) {
  useMock = value;
}

export function getUseMock() {
  return useMock;
}
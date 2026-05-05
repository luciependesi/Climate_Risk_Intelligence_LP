// This file defines API functions for interacting with devices.
// src/api/devices.js
import { apiGet } from "./client";

/**
 * @typedef {Object} Device
 * @property {string} id
 * @property {string} name
 * @property {string} status
 */

export const devicesApi = {
  /** @returns {Promise<Device[]>} */
  list() {
    return apiGet("/api/devices");
  },

  /** @param {string} deviceId */
  get(deviceId) {
    return apiGet(`/api/devices/${deviceId}`);
  },
};
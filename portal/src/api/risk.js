// src/api/risk.js
// This file contains API calls related to risk assessment and scoring for devices.
import { apiGet } from "./client";

/**
 * @typedef {Object} RiskPoint
 * @property {string} device_id
 * @property {string} timestamp
 * @property {number} risk_score
 */

export const riskApi = {
  /** @param {string} deviceId */
  history(deviceId) {
    return apiGet(`/risk/history?device_id=${deviceId}&limit=50`);
  },

  latest() {
    return apiGet("/risk/latest");
  },
};
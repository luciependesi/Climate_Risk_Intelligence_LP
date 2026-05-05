// src/api/sensor.js
// This file contains API calls related to sensor data, such as fetching historical readings from the server.
import { apiGet } from "./client";

/**
 * @typedef {Object} SensorReading
 * @property {string} device_id
 * @property {string} timestamp
 * @property {number} mq135_ppm
 * @property {number} water_level
 */

export const sensorApi = {
  /** @param {string} deviceId */
  history(deviceId) {
    return apiGet(`/api/sensor/history?device_id=${deviceId}&limit=50`);
  },
};
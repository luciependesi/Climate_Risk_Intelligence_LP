// src/api/auth.js
// This module provides functions for user authentication, including longin and logout.
import { apiPost, setAuthToken, clearTokens } from "./client";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 */

/**
 * @typedef {Object} LoginResponse
 * @property {User} user
 * @property {string} access_token
 * @property {string} token_type
 * @property {string} [refresh_token]
 */

export const authApi = {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginResponse>}
   */
  async login(email, password) {
    const res = await apiPost("/auth/login", { email, password });
    setAuthToken(res.access_token, res.refresh_token);
    return res;
  },

  logout() {
    clearTokens();
  },
};
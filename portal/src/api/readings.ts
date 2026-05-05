//This module defines the client-side function to fetch the latest sensor readings from the backend API.
import { apiGet } from "./client";

export function getLatestReadings() {
  return apiGet("/readings/latest");
}
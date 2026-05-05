// this file is used to display a 404 page when the user navigation to a route that does not exist.
// src/pages/NotFound.jsx
import React from "react";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
    </div>
  );
}
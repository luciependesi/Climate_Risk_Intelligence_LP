// src/context/ToastProvider.jsx
// This component provides a context for showing toast notifications accross the app.
// ToastProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { registerToastHandler } from "../api/client";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "info") {
    const id = Date.now();

    setToasts((t) => [...t, { id, message, type, leaving: false }]);

    // Start fade-out before removal
    setTimeout(() => startFadeOut(id), 3000);
  }

  function startFadeOut(id) {
    setToasts((t) =>
      t.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast
      )
    );

    // Remove after fade-out animation
    setTimeout(() => dismissToast(id), 400);
  }

  function dismissToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  useEffect(() => {
    registerToastHandler(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type} ${t.leaving ? "fade-out" : "slide-in"}`}
          >
            <span>{t.message}</span>
            <button className="toast-dismiss" onClick={() => startFadeOut(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
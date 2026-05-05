// simple login page that calls the api.login function and updates the user context on success.
// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../auth/UserContext";
import { useToast } from "../context/ToastProvider";
import { api, setAuthToken } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const res = await api.login(email, password);
    setAuthToken(res.access_token);
    login({ user: res.user, access_token: res.access_token });

    showToast("Logged in successfully", "success");
    navigate("/", { replace: true });
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
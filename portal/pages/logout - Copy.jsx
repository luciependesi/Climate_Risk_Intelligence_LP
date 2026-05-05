import { setAuthToken } from "../api/client";

function handleLogout() {
  logout();
  setAuthToken(null);
  showToast("Logged out", "info");
  navigate("/login", { replace: true });
}
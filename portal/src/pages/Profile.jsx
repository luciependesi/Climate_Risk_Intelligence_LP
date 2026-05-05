import { useNavigate } from "react-router-dom";
import { useUser } from "../auth/UserContext";
import { useToast } from "../context/ToastProvider";

export default function Profile() {
  const { user, logout } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast("Logged out", "info");
    navigate("/login", { replace: true });
  }

  return (
    <div className="card fade" style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <div className="card-title">User Profile</div>

      <p><strong>Name:</strong> {user?.name || "Unknown"}</p>
      <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      <p><strong>Role:</strong> {user?.role || "Subscriber"}</p>

      <hr style={{ margin: "1rem 0", borderColor: "#333" }} />

      <button className="btn-primary" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
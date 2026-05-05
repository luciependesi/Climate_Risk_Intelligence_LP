import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import { useUser } from "../auth/UserContext";

export default function Layout() {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <Sidebar subscriber={user} />

      <div className="dashboard-content">
        <NavBar subscriber={user} />
        <Outlet />
      </div>
    </div>
  );
}
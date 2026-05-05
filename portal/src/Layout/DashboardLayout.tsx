// this is the main layout for the dashboard, it includes the Navbar and the sidebar.
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { NavBar } from "../components/NavBar";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout() {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        background: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

      <div style={{ display: "flex", flex: 1 }}>
        {sidebarOpen && (
          <Sidebar mobile={isMobile} onClose={() => setSidebarOpen(false)} />
        )}

        <main
          style={{
            flex: 1,
            padding: 16,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
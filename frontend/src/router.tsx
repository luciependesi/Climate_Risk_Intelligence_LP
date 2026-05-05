import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DeviceDetailPage } from "./components/DeviceDetailPage";
import { DeviceMapPage } from "./pages/DeviceMapPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "device/:deviceId", element: <DeviceDetailPageWrapper /> },
      { path: "map", element: <DeviceMapPage /> },
    ],
  },
]);

function DeviceDetailPageWrapper() {
  const { deviceId } = useParams();
  return <DeviceDetailPage deviceId={deviceId!} />;
}
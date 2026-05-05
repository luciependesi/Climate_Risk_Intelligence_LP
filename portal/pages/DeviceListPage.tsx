import { useEffect, useState } from "react";
import { DeviceDetailDrawer } from "../components/DeviceDetailDrawer";
import { DeviceManagementPanel } from "../components/DeviceManagementPanel";
import { FirmwareBadge } from "../components/FirmwareBadge";

export type Device = {
  id: number;
  api_key: string | null;
  is_active: number;
  latitude: number | null;
  longitude: number | null;
  last_seen: string | null;
  registered_at: string | null;
  name: string | null;
  firmware_ver: string | null;
  location_hint: string | null;
  is_online: boolean;
};

export function DeviceListPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Initial load
  useEffect(() => {
    fetch("/api/devices")
      .then((r) => r.json())
      .then(setDevices)
      .catch(console.error);
  }, []);

  // Live status updates
  useEffect(() => {
    const ws = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.host
      }/ws/devices`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as {
        device_id: number;
        last_seen: string;
        is_online: boolean;
      };

      setDevices((prev) =>
        prev.map((d) =>
          d.id === msg.device_id
            ? { ...d, last_seen: msg.last_seen, is_online: msg.is_online }
            : d
        )
      );
    };

    ws.onerror = console.error;
    return () => ws.close();
  }, []);

  const updateDevice = async (
    id: number,
    patch: Partial<Pick<Device, "name" | "firmware_ver" | "location_hint" | "is_active">>
  ) => {
    await fetch(`/api/devices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Devices</h1>
      <p style={{ opacity: 0.7, marginBottom: "1rem" }}>
        Live device registry with online status, firmware, and management.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Firmware</th>
            <th>Location</th>
            <th>Last seen</th>
            <th>Status</th>
            <th>Active</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                <input
                  defaultValue={d.name ?? ""}
                  onBlur={(e) =>
                    updateDevice(d.id, { name: e.target.value || null })
                  }
                />
              </td>
              <td>
                <FirmwareBadge firmware={d.firmware_ver} />
                <input
                  style={{ marginLeft: "0.5rem" }}
                  defaultValue={d.firmware_ver ?? ""}
                  onBlur={(e) =>
                    updateDevice(d.id, {
                      firmware_ver: e.target.value || null,
                    })
                  }
                />
              </td>
              <td>
                <input
                  defaultValue={d.location_hint ?? ""}
                  onBlur={(e) =>
                    updateDevice(d.id, {
                      location_hint: e.target.value || null,
                    })
                  }
                />
              </td>
              <td>{d.last_seen ?? "—"}</td>
              <td>
                <span
                  style={{
                    color: d.is_online ? "green" : "red",
                    fontWeight: 600,
                  }}
                >
                  {d.is_online ? "Online" : "Offline"}
                </span>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={d.is_active === 1}
                  onChange={(e) =>
                    updateDevice(d.id, {
                      is_active: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </td>
              <td>
                <button onClick={() => setSelectedDevice(d)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDevice && (
        <>
          <DeviceDetailDrawer
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
          />
          <DeviceManagementPanel
            device={selectedDevice}
            onUpdate={updateDevice}
          />
        </>
      )}
    </div>
  );
}
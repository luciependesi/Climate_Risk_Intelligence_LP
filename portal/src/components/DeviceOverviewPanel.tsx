// src/components/DeviceOverviewPanel.tsx
import { useDeviceContext } from "../context/DeviceContext";

interface Props {
  onSelect: (id: string) => void;
}

export function DeviceOverviewPanel({ onSelect }: Props) {
  const { devices, deviceIds, selectedDeviceId } = useDeviceContext();

  if (deviceIds.length === 0) {
    return <div className="card">No devices available…</div>;
  }

  return (
    <div className="card">
      <h3>Devices</h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {deviceIds.map((id) => {
          const d = devices[id];

          return (
            <li
              key={id}
              onClick={() => onSelect(id)}
              style={{
                padding: "8px 10px",
                marginBottom: 4,
                borderRadius: 6,
                cursor: "pointer",
                background:
                  id === selectedDeviceId
                    ? "rgba(24,144,255,0.1)"
                    : "transparent",
                border:
                  id === selectedDeviceId
                    ? "1px solid #1890ff"
                    : "1px solid #f0f0f0",
              }}
            >
              <div style={{ fontWeight: 600 }}>{d.name ?? id}</div>

              {d.latitude && d.longitude && (
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
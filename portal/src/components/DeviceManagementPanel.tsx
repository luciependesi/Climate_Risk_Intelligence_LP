import type { Device } from "../pages/DeviceListPage";

type Props = {
  device: Device;
  onUpdate: (
    id: number,
    patch: Partial<
      Pick<Device, "name" | "firmware_ver" | "location_hint" | "is_active">
    >
  ) => Promise<void> | void;
};

export function DeviceManagementPanel({ device, onUpdate }: Props) {
  const deactivate = () =>
    onUpdate(device.id, {
      is_active: 0,
    });

  const activate = () =>
    onUpdate(device.id, {
      is_active: 1,
    });

  const resetName = () =>
    onUpdate(device.id, {
      name: null,
    });

  const clearLocation = () =>
    onUpdate(device.id, {
      location_hint: null,
    });

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        padding: "1rem",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 30,
        minWidth: "260px",
      }}
    >
      <h3>Manage device {device.id}</h3>
      <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
        Quick actions for this node.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {device.is_active === 1 ? (
          <button onClick={deactivate}>Deactivate</button>
        ) : (
          <button onClick={activate}>Activate</button>
        )}
        <button onClick={resetName}>Reset name</button>
        <button onClick={clearLocation}>Clear location hint</button>
      </div>
    </div>
  );
}
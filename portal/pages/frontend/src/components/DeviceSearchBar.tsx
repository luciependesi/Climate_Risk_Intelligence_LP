import React from "react";
import "./DeviceSearchBar.css";

export const DeviceSearchBar: React.FC<{ onChange: (v: string) => void }> = ({
  onChange,
}) => {
  return (
    <input
      className="device-search"
      placeholder="Search devices..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
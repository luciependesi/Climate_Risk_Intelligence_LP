//Cluster selector component that allows users to select a cluter from a list of clusters.
// src/components/ClusterSelector.tsx
import React from "react";
import VirtualBadge from "./VirtualBadge";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { useDeviceContext } from "../context/DeviceContext";

export function ClusterSelector({
  clusters,
  selected,
  onSelect,
}: {
  clusters: any[];
  selected: string | number;
  onSelect: (id: string | number) => void;
}) {
  const { isVirtual } = useDeviceContext();

  return (
    <div className="card fade">
      <div className="flex items-center justify-between mb-2">
        <h3 className="card-title flex items-center gap-2">
          Clusters
          <VirtualBadge isVirtual={isVirtual} />
        </h3>

        <ConfidenceIndicator isVirtual={isVirtual} />
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
        {clusters.map((c: any) => {
          const active = selected === c.id;

          return (
            <li
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderRadius: 8,
                marginBottom: 8,
                transition: "all 0.2s ease",
                background: active
                  ? "rgba(88,166,255,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: active ? "1px solid #58a6ff" : "1px solid #333",
                opacity: isVirtual ? 0.7 : 1, // ⭐ virtual-aware shading
              }}
              className="hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <span>{c.name}</span>
                {active && (
                  <span style={{ color: "#58a6ff", fontSize: "0.8rem" }}>
                    ●
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
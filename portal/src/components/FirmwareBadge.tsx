type Props = {
  firmware: string | null;
};

const CURRENT_FIRMWARE = "v1.0.0"; // adjust or fetch from API later

function compareFirmware(a: string, b: string): number {
  // naive semantic-ish compare: v1.2.3
  const pa = a.replace(/^v/, "").split(".").map(Number);
  const pb = b.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

export function FirmwareBadge({ firmware }: Props) {
  if (!firmware) {
    return (
      <span
        style={{
          padding: "0.1rem 0.4rem",
          borderRadius: "999px",
          background: "#eee",
          fontSize: "0.75rem",
        }}
      >
        unknown
      </span>
    );
  }

  const cmp = compareFirmware(firmware, CURRENT_FIRMWARE);
  const isCurrent = cmp === 0;
  const isBehind = cmp < 0;
  const isAhead = cmp > 0;

  let color = "#ccc";
  let label = firmware;

  if (isCurrent) {
    color = "#16a34a";
    label = `${firmware} (current)`;
  } else if (isBehind) {
    color = "#f97316";
    label = `${firmware} (outdated)`;
  } else if (isAhead) {
    color = "#0ea5e9";
    label = `${firmware} (ahead)`;
  }

  return (
    <span
      style={{
        padding: "0.1rem 0.4rem",
        borderRadius: "999px",
        background: color,
        color: "white",
        fontSize: "0.75rem",
      }}
    >
      {label}
    </span>
  );
}
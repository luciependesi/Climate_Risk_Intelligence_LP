import { useState } from "react";

export function useMode() {
  const [mode, setMode] = useState<"mock" | "live">("mock");
  return { mode, setMode };
}
import React, { useEffect, useRef, useState } from "react";

export default function ChartContainer({ children, minHeight = 260 }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new ResizeObserver(() => {
      if (ref.current.offsetWidth > 0 && ref.current.offsetHeight > 0) {
        setReady(true);
      }
    });

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", minHeight }}>
      {ready ? children : null}
    </div>
  );
}
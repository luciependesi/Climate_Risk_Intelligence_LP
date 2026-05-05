import { useEffect, useState } from "react";

export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const diff = value - display;
    const step = diff / 20;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setDisplay((d) => d + step);
      if (frame >= 20) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{display.toFixed(1)}</span>;
}
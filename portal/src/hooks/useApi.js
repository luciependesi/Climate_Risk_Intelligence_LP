import { useEffect, useState } from "react";

export function useApi<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fn().then(setData);
  }, []);

  return data;
}
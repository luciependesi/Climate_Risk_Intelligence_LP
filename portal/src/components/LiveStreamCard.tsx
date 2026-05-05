// This component is a placeholder for displaying live stream data.
import { useLiveStream } from "../hooks/useLiveStream";

export function LiveStreamCard() {
  const data = useLiveStream();

  return (
    <div className="card">
      <h3>Live Stream</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <div>Waiting for live data…</div>
      )}
    </div>
  );
}
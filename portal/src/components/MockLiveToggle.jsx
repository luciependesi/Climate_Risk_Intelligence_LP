export default function MockLiveToggle({ mode, setMode }) {
  return (
    <div className="toggle-container">
      <button
        className={mode === "live" ? "active" : ""}
        onClick={() => setMode("live")}
      >
        Live
      </button>
      <button
        className={mode === "mock" ? "active" : ""}
        onClick={() => setMode("mock")}
      >
        Mock
      </button>
    </div>
  );
}
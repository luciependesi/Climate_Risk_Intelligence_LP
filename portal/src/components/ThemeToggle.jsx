export default function ThemeToggle() {
  function toggleTheme() {
    document.body.classList.toggle("light");
  }

  return (
    <button onClick={toggleTheme} className="card fade" style={{ cursor: "pointer" }}>
      Toggle Theme
    </button>
  );
}
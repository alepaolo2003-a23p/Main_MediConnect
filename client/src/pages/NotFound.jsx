import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 60, margin: 0, color: "#2563eb" }}>404</h1>
      <p style={{ color: "#64748b" }}>La página que buscas no existe.</p>
      <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
        Volver al inicio
      </Link>
    </div>
  );
}

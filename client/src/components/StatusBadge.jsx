import "./StatusBadge.scss";

const LABELS = {
  reservada: "Reservada",
  confirmada: "Confirmada",
  atendida: "Atendida",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

const TONES = {
  reservada: "warning",
  confirmada: "info",
  atendida: "success",
  cancelada: "danger",
  no_asistio: "danger",
};

export function StatusBadge({ status }) {
  const tone = TONES[status] || "default";
  const label = LABELS[status] || status;
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}

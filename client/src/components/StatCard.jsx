import "./StatCard.scss";

export function StatCard({ icon, label, value, hint, tone = "default" }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
        {hint && <span className="stat-card__hint">{hint}</span>}
      </div>
    </div>
  );
}

export function Logo({ variant = "dark", size = 28 }) {
  const color = variant === "light" ? "#ffffff" : "#2563eb";
  const textColor = variant === "light" ? "#ffffff" : "#0f172a";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill={color} />
        <path
          d="M12 6.5V17.5M6.5 12H17.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 700, fontSize: size * 0.62, color: textColor }}>
          MediConnect
        </div>
        <div
          style={{
            fontSize: size * 0.32,
            color: variant === "light" ? "rgba(255,255,255,0.75)" : "#64748b",
          }}
        >
          Cuidamos de ti y tu familia
        </div>
      </div>
    </div>
  );
}

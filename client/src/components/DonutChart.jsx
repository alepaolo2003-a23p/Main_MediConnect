import "./DonutChart.scss";

/**
 * segments: [{ label, value, color }]
 */
export function DonutChart({ segments, size = 160, thickness = 22, centerLabel, centerValue }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAcc = 0;

  return (
    <div className="donut-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#eef1f5"
            strokeWidth={thickness}
          />
          {segments.map((seg, i) => {
            const fraction = seg.value / total;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const dashoffset = -((offsetAcc / total) * circumference);
            offsetAcc += seg.value;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={dashoffset}
                strokeLinecap="butt"
              />
            );
          })}
        </g>
        {centerValue !== undefined && (
          <text x="50%" y="47%" textAnchor="middle" className="donut-chart__value">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x="50%" y="60%" textAnchor="middle" className="donut-chart__label">
            {centerLabel}
          </text>
        )}
      </svg>

      <ul className="donut-chart__legend">
        {segments.map((seg, i) => (
          <li key={i}>
            <span className="dot" style={{ background: seg.color }} />
            {seg.label}
            <strong>
              {total ? Math.round((seg.value / total) * 100) : 0}%
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

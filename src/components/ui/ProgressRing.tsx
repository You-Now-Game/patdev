type Props = {
  percent: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function ProgressRing({ percent, color, size = 110, strokeWidth = 9, label }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#eee9db"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-ink"
            style={{ fontSize: Math.max(11, size * 0.2) }}
          >
            {clamped}%
          </span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-ink text-center">{label}</span>}
    </div>
  );
}

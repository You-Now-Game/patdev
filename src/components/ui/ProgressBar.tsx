export function ProgressBar({
  percent,
  color,
  trackClassName = "bg-[#eee9db]",
}: {
  percent: number;
  color: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={`h-2.5 w-full rounded-full ${trackClassName}`}>
      <div
        className="h-2.5 rounded-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}

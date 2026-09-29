"use client";

export function RoleCard({
  code,
  title,
  subtitle,
  active,
  onClick,
}: {
  code: string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 rounded-xl border-2 p-4 text-left transition-colors ${
        active ? "border-brand bg-sage-50" : "border-border bg-white"
      }`}
    >
      <span
        className={`absolute right-3 top-3 h-4 w-4 rounded-full border-2 ${
          active ? "border-brand bg-brand" : "border-border"
        }`}
      />
      <span
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          active ? "bg-brand text-white" : "bg-cream-200 text-ink-muted"
        }`}
      >
        {code}
      </span>
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-xs text-ink-muted">{subtitle}</p>
    </button>
  );
}

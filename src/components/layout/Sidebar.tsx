import { NavLink } from "./NavLink";

export function Sidebar({
  items,
  accessTitle,
  accessNote,
}: {
  items: { href: string; label: string }[];
  accessTitle: string;
  accessNote: string;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-white px-4 py-6">
      <div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Разделы
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </div>
      <div className="rounded-xl bg-cream-200 px-3 py-3">
        <p className="text-xs text-ink-muted">Режим доступа</p>
        <p className="text-sm font-semibold text-ink">{accessTitle}</p>
        <p className="text-xs text-ink-muted">{accessNote}</p>
      </div>
    </aside>
  );
}

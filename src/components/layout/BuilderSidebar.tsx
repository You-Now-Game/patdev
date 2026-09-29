"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BuilderSidebar({ objectIds }: { objectIds: string[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/builder\/objects\/([^/]+)/);
  const currentId = match?.[1] ?? objectIds[0];

  const items = [
    { href: "/builder/objects", label: "Объекты", match: (p: string) => p === "/builder/objects" },
    {
      href: currentId ? `/builder/objects/${currentId}/works` : "/builder/objects",
      label: "Типы работ",
      match: (p: string) => p.endsWith("/works"),
    },
    {
      href: currentId ? `/builder/objects/${currentId}/visits` : "/builder/objects",
      label: "Время",
      match: (p: string) => p.endsWith("/visits"),
    },
    {
      href: currentId ? `/builder/objects/${currentId}/materials` : "/builder/objects",
      label: "Материалы",
      match: (p: string) => p.endsWith("/materials"),
    },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-white px-4 py-6">
      <div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Разделы
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-sage-100 text-brand-dark" : "text-ink-light hover:bg-cream-200"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${active ? "bg-brand" : "bg-ink-muted/50"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="rounded-xl bg-cream-200 px-3 py-3">
        <p className="text-xs text-ink-muted">Режим доступа</p>
        <p className="text-sm font-semibold text-ink">Редактирование</p>
        <p className="text-xs text-ink-muted">изменения видны клиенту</p>
      </div>
    </aside>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import { objectTypeLabel } from "@/lib/utils";

type ObjectOption = { id: string; type: "APARTMENT" | "HOUSE"; address: string };

export function ObjectSwitcher({ objects, currentId }: { objects: ObjectOption[]; currentId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(nextId: string) {
    const next = pathname.replace(currentId, nextId);
    router.push(next);
  }

  return (
    <div className="relative inline-block">
      <select
        value={currentId}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-border bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink outline-none focus:border-brand"
      >
        {objects.map((o) => (
          <option key={o.id} value={o.id}>
            Объект: {objectTypeLabel(o.type)} · {o.address}
          </option>
        ))}
      </select>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

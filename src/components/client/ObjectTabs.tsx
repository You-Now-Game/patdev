import Link from "next/link";
import { objectTypeLabel } from "@/lib/utils";

type ObjectSummary = { id: string; type: "APARTMENT" | "HOUSE" };

export function ObjectTabs({
  objects,
  activeId,
  basePath,
}: {
  objects: ObjectSummary[];
  activeId: string;
  basePath: string;
}) {
  if (objects.length < 2) return null;

  return (
    <div className="inline-flex rounded-xl border border-border bg-cream-200 p-1">
      {objects.map((o) => (
        <Link
          key={o.id}
          href={`${basePath}?object=${o.id}`}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            o.id === activeId ? "bg-white text-ink shadow-sm" : "text-ink-light"
          }`}
        >
          {objectTypeLabel(o.type)}
        </Link>
      ))}
    </div>
  );
}

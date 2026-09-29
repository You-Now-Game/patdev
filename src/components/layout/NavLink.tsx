"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href.length > 1 && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-sage-100 text-brand-dark" : "text-ink-light hover:bg-cream-200"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${active ? "bg-brand" : "bg-ink-muted/50"}`}
      />
      {label}
    </Link>
  );
}

import { Logo } from "./Logo";
import { signOut } from "@/lib/auth";

export function Topbar({
  roleLabel,
  userName,
  center,
}: {
  roleLabel: string;
  userName: string;
  center?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-cream px-6">
      <Logo />
      {center && <div className="hidden md:block">{center}</div>}
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          {roleLabel}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-brand-dark">
          {userName.charAt(0)}
        </div>
        <span className="text-sm font-medium text-ink">{userName}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="text-sm text-ink-light hover:text-ink" type="submit">
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}

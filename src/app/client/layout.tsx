import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

const NAV_ITEMS = [
  { href: "/client/object", label: "Объект" },
  { href: "/client/works", label: "Типы работ" },
  { href: "/client/visits", label: "Время" },
  { href: "/client/materials", label: "Материалы" },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") redirect("/login?portal=client");

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar roleLabel="Клиент" userName={session.user.name} />
      <div className="flex flex-1">
        <Sidebar
          items={NAV_ITEMS}
          accessTitle="Только просмотр"
          accessNote="данные вносит строитель"
        />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

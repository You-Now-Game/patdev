import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

const NAV_ITEMS = [
  { href: "/admin/users", label: "Пользователи" },
  { href: "/admin/objects", label: "Объекты" },
  { href: "/builder/objects", label: "Кабинет строителя" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar roleLabel="Администратор" userName={session.user.name} />
      <div className="flex flex-1">
        <Sidebar
          items={NAV_ITEMS}
          accessTitle="Полный доступ"
          accessNote="управление пользователями и объектами"
        />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

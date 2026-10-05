import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBuilderObjectsList } from "@/lib/queries";
import { Topbar } from "@/components/layout/Topbar";
import { BuilderSidebar } from "@/components/layout/BuilderSidebar";
import { canEditAsBuilder } from "@/lib/access";

export default async function BuilderLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !canEditAsBuilder(session.user.role)) redirect("/login?portal=builder");

  const objects = await getBuilderObjectsList(session.user.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar roleLabel="Строитель" userName={session.user.name} />
      <div className="flex flex-1">
        <BuilderSidebar objectIds={objects.map((o) => o.id)} showAdminLink={session.user.role === "ADMIN"} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

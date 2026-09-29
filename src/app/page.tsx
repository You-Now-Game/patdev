import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { portalPath } from "@/lib/portal";

export default async function RootPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  redirect(portalPath(session.user.role));
}

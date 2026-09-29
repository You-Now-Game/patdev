import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { portalPath } from "@/lib/portal";
import { AuthPromoPanel } from "@/components/auth/AuthPromoPanel";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(portalPath(session.user.role));
  }

  const sp = await searchParams;

  return (
    <div className="flex min-h-screen">
      <AuthPromoPanel />
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <RegisterForm error={sp.error} />
      </div>
    </div>
  );
}

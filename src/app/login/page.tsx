import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthPromoPanel } from "@/components/auth/AuthPromoPanel";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string; portal?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "CLIENT" ? "/client/object" : "/builder/objects");
  }

  const sp = await searchParams;
  const initialRole = sp.role === "BUILDER" || sp.portal === "builder" ? "BUILDER" : "CLIENT";

  return (
    <div className="flex min-h-screen">
      <AuthPromoPanel />
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <LoginForm initialRole={initialRole} error={sp.error} />
      </div>
    </div>
  );
}

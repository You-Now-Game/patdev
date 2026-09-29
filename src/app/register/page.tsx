import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthPromoPanel } from "@/components/auth/AuthPromoPanel";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "CLIENT" ? "/client/object" : "/builder/objects");
  }

  const sp = await searchParams;
  const initialRole = sp.role === "BUILDER" ? "BUILDER" : "CLIENT";

  return (
    <div className="flex min-h-screen">
      <AuthPromoPanel />
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <RegisterForm initialRole={initialRole} error={sp.error} />
      </div>
    </div>
  );
}

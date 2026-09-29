import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/queries";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const [users, sp] = await Promise.all([getAllUsers(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Пользователи</h1>
        <p className="text-sm text-ink-muted">
          Строителей и администраторов заводите здесь — публичная регистрация доступна только клиентам
        </p>
      </div>

      <AdminUsersManager users={users} currentUserId={session!.user.id} error={sp.error} />
    </div>
  );
}

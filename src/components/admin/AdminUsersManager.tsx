"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { createUserAction, deleteUserAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";
import type { Role } from "@prisma/client";

const ROLE_LABELS: Record<Role, string> = {
  CLIENT: "Клиент",
  BUILDER: "Строитель",
  ADMIN: "Администратор",
};

type UserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  createdAt: Date;
  _count: { builderObjects: number; clientObjects: number };
};

export function AdminUsersManager({
  users,
  currentUserId,
  error,
}: {
  users: UserRow[];
  currentUserId: string;
  error?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (typeof window !== "undefined" && !window.confirm(`Удалить пользователя «${name}»? Это действие необратимо.`)) return;
    startTransition(async () => {
      await deleteUserAction(id);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-4 font-semibold text-ink">Все пользователи</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="pb-2 font-medium">Имя</th>
                <th className="pb-2 font-medium">Логин</th>
                <th className="pb-2 font-medium">Роль</th>
                <th className="pb-2 font-medium">Объектов</th>
                <th className="pb-2 font-medium">Создан</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-semibold text-ink">
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-xs font-normal text-ink-muted">(вы)</span>
                    )}
                  </td>
                  <td className="py-3 text-ink-light">{u.email ?? u.phone}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-semibold text-brand-dark">
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="py-3 text-ink-light">
                    {u.role === "BUILDER"
                      ? u._count.builderObjects
                      : u.role === "CLIENT"
                        ? u._count.clientObjects
                        : "—"}
                  </td>
                  <td className="py-3 text-ink-light">{formatDate(u.createdAt)}</td>
                  <td className="py-3 text-right">
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={isPending}
                        className="text-xs font-medium text-red-500"
                      >
                        удалить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-4 font-semibold text-ink">Создать пользователя</p>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}
        <form action={createUserAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Имя</span>
            <input
              name="name"
              required
              className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Роль</span>
            <select
              name="role"
              defaultValue="BUILDER"
              className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
            >
              <option value="BUILDER">Строитель</option>
              <option value="CLIENT">Клиент</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Телефон или e-mail</span>
            <input
              name="login"
              required
              placeholder="ivan@patinastudio.ru"
              className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-light">Пароль</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Не короче 6 символов"
              className="rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              Создать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

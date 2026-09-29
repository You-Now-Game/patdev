"use client";

import { Button } from "@/components/ui/Button";
import { loginAction } from "@/lib/actions/auth";

export function AdminLoginForm({ error }: { error?: string }) {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink">Вход для администратора</h1>
      <p className="mb-6 text-sm text-ink-muted">Управление пользователями и объектами</p>

      <form action={loginAction} className="flex flex-col gap-4">
        <input type="hidden" name="role" value="ADMIN" />

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-light">Телефон или e-mail</span>
          <input
            name="login"
            type="text"
            required
            placeholder="admin@patinastudio.ru"
            className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-light">Пароль</span>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}

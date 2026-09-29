"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/lib/actions/auth";

export function RegisterForm({ error }: { error?: string }) {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink">Регистрация клиента</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Следите за ходом ремонта — фото, прогресс, визиты и материалы
      </p>

      <form action={registerAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-light">Имя</span>
          <input
            name="name"
            type="text"
            required
            placeholder="Анна Смирнова"
            className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-light">Телефон или e-mail</span>
          <input
            name="login"
            type="text"
            required
            placeholder="anna@mail.ru"
            className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-light">Пароль</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Не короче 6 символов"
            className="rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
      </form>

      <p className="mt-3 rounded-xl bg-cream-200 px-4 py-2.5 text-xs text-ink-muted">
        После регистрации попросите строителя привязать вас к объекту по этому e-mail/телефону.
        Аккаунты строителей заводит администратор.
      </p>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Уже есть аккаунт?{" "}
        <Link href="/login?role=CLIENT" className="font-semibold text-brand">
          Войти
        </Link>
      </p>
    </div>
  );
}

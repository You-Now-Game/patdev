"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleCard } from "./RoleCard";
import { Button } from "@/components/ui/Button";
import { registerAction } from "@/lib/actions/auth";

export function RegisterForm({ initialRole, error }: { initialRole: "CLIENT" | "BUILDER"; error?: string }) {
  const [role, setRole] = useState<"CLIENT" | "BUILDER">(initialRole);

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-ink">Регистрация</h1>
      <p className="mb-6 text-sm text-ink-muted">Выберите свою роль в Patina Studio</p>

      <div className="mb-5 flex gap-3">
        <RoleCard
          code="К"
          title="Я клиент"
          subtitle="Слежу за ходом ремонта"
          active={role === "CLIENT"}
          onClick={() => setRole("CLIENT")}
        />
        <RoleCard
          code="С"
          title="Я строитель"
          subtitle="Веду объекты и отчёты"
          active={role === "BUILDER"}
          onClick={() => setRole("BUILDER")}
        />
      </div>

      <form action={registerAction} className="flex flex-col gap-4">
        <input type="hidden" name="role" value={role} />

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
          Зарегистрироваться как {role === "CLIENT" ? "клиент" : "строитель"}
        </Button>
      </form>

      {role === "CLIENT" && (
        <p className="mt-3 rounded-xl bg-cream-200 px-4 py-2.5 text-xs text-ink-muted">
          После регистрации попросите строителя привязать вас к объекту по этому e-mail/телефону.
        </p>
      )}

      <p className="mt-4 text-center text-sm text-ink-muted">
        Уже есть аккаунт?{" "}
        <Link href={`/login?role=${role}`} className="font-semibold text-brand">
          Войти
        </Link>
      </p>
    </div>
  );
}

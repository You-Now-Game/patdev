"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import type { Role } from "@prisma/client";

function portalPath(role: Role) {
  return role === "CLIENT" ? "/client/object" : "/builder/objects";
}

export async function loginAction(formData: FormData) {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!login || !password) {
    redirect(`/login?role=${role}&error=${encodeURIComponent("Заполните телефон/e-mail и пароль")}`);
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { phone: login }] },
  });
  if (existing && existing.role !== role) {
    const message =
      existing.role === "BUILDER"
        ? "Этот аккаунт зарегистрирован как строитель — переключите роль слева"
        : "Этот аккаунт зарегистрирован как клиент — переключите роль слева";
    redirect(`/login?role=${role}&error=${encodeURIComponent(message)}`);
  }

  try {
    await signIn("credentials", {
      login,
      password,
      role,
      redirectTo: portalPath(role),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/login?role=${role}&error=${encodeURIComponent("Неверный телефон/e-mail или пароль")}`
      );
    }
    throw error;
  }
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!name || !login || !password) {
    redirect(`/register?role=${role}&error=${encodeURIComponent("Заполните все поля")}`);
  }
  if (password.length < 6) {
    redirect(`/register?role=${role}&error=${encodeURIComponent("Пароль должен быть не короче 6 символов")}`);
  }

  const isEmail = login.includes("@");
  const existing = await prisma.user.findFirst({
    where: isEmail ? { email: login } : { phone: login },
  });
  if (existing) {
    redirect(`/register?role=${role}&error=${encodeURIComponent("Аккаунт с такими данными уже существует")}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      role,
      passwordHash,
      email: isEmail ? login : undefined,
      phone: isEmail ? undefined : login,
    },
  });

  try {
    await signIn("credentials", { login, password, role, redirectTo: portalPath(role) });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login");
    }
    throw error;
  }
}

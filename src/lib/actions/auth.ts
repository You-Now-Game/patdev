"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { portalPath } from "@/lib/portal";
import type { Role } from "@prisma/client";

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
  const canUseRole =
    !!existing && (existing.role === role || (existing.role === "ADMIN" && role === "BUILDER"));
  if (existing && !canUseRole) {
    const roleLabel: Record<Role, string> = {
      CLIENT: "клиент",
      BUILDER: "строитель",
      ADMIN: "администратор",
    };
    const message = `Этот аккаунт зарегистрирован как ${roleLabel[existing.role]} — переключите роль слева`;
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

// Публичная регистрация доступна только для роли "клиент". Аккаунты
// строителей и администратора заводит администратор из /admin/users —
// это закрывает риск, что кто угодно самостоятельно зарегистрируется
// как строитель и получит доступ к редактированию чужих объектов.
const role: Role = "CLIENT";

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !login || !password) {
    redirect(`/register?error=${encodeURIComponent("Заполните все поля")}`);
  }
  if (password.length < 6) {
    redirect(`/register?error=${encodeURIComponent("Пароль должен быть не короче 6 символов")}`);
  }

  const isEmail = login.includes("@");
  const existing = await prisma.user.findFirst({
    where: isEmail ? { email: login } : { phone: login },
  });
  if (existing) {
    redirect(`/register?error=${encodeURIComponent("Аккаунт с такими данными уже существует")}`);
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

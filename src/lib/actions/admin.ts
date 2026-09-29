"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Не авторизован");
  return session.user;
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!name || !login || !password || !role) {
    redirect(`/admin/users?error=${encodeURIComponent("Заполните все поля")}`);
  }
  if (password.length < 6) {
    redirect(`/admin/users?error=${encodeURIComponent("Пароль должен быть не короче 6 символов")}`);
  }

  const isEmail = login.includes("@");
  const existing = await prisma.user.findFirst({
    where: isEmail ? { email: login } : { phone: login },
  });
  if (existing) {
    redirect(`/admin/users?error=${encodeURIComponent("Аккаунт с такими данными уже существует")}`);
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

  revalidatePath("/admin/users");
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    throw new Error("Нельзя удалить собственный аккаунт");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/admin/objects");
}

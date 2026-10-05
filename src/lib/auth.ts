import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        login: { label: "Телефон или e-mail", type: "text" },
        password: { label: "Пароль", type: "password" },
        role: { label: "Роль", type: "text" },
      },
      async authorize(credentials) {
        const login = credentials?.login as string | undefined;
        const password = credentials?.password as string | undefined;
        const role = credentials?.role as Role | undefined;
        if (!login || !password || !role) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: login }, { phone: login }] },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        const canUseRole = user.role === role || (user.role === "ADMIN" && role === "BUILDER");
        if (!canUseRole) return null;

        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
});

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/client") && role !== "CLIENT") {
    return NextResponse.redirect(new URL("/login?portal=client", req.url));
  }
  if (pathname.startsWith("/builder") && role !== "BUILDER") {
    return NextResponse.redirect(new URL("/login?portal=builder", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/client/:path*", "/builder/:path*"],
};

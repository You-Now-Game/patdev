import type { Role } from "@prisma/client";

export function portalPath(role: Role): string {
  if (role === "CLIENT") return "/client/object";
  if (role === "BUILDER") return "/builder/objects";
  return "/admin/users";
}

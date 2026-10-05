export function canEditAsBuilder(role: string | undefined) {
  return role === "BUILDER" || role === "ADMIN";
}

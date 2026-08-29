const HANDBOOK_ROLES = ["owner", "admin", "developer"] as const;

export type HandbookRole = (typeof HANDBOOK_ROLES)[number];

export function canAccessHandbook(role: unknown) {
  return HANDBOOK_ROLES.includes(role as HandbookRole);
}

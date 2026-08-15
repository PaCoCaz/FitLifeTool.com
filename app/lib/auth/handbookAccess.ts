const HANDBOOK_ROLES = ["owner", "admin", "developer"] as const;

export function canAccessHandbook(role: unknown) {
  return HANDBOOK_ROLES.includes(
    role as (typeof HANDBOOK_ROLES)[number]
  );
}

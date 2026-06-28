export const APP_ROLES = {
  ADMIN: "ADMIN_ROLE",
  DEV: "DEV_ROLE",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

const GROUP_TO_ROLE: Record<string, AppRole> = {
  ADMIN_GROUP: APP_ROLES.ADMIN,
  DEV_GROUP: APP_ROLES.DEV,
};

export const getUserRoles = (profile?: Record<string, unknown> | null): AppRole[] => {
  if (!profile) {
    return [];
  }

  const groups = profile["cognito:groups"];
  const groupValues = Array.isArray(groups)
    ? groups
    : typeof groups === "string"
      ? groups.split(",")
      : [];

  return Array.from(
    new Set(
      groupValues
        .map((group) => group.trim().toUpperCase())
        .map((group) => GROUP_TO_ROLE[group])
        .filter((role): role is AppRole => Boolean(role))
    )
  );
};
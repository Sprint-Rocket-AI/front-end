export const APP_ROLES = {
  ADMIN: "ADMIN_ROLE",
  DEV: "DEV_ROLE",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

type ProfileValue = string | string[] | undefined | null;

const isAppRole = (value: string): value is AppRole =>
  value === APP_ROLES.ADMIN || value === APP_ROLES.DEV;

const normalizeRoleValue = (value: string) => value.trim().toUpperCase();

const extractRoleValues = (value: ProfileValue): AppRole[] => {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : value.split(",");

  return values
    .map((role) => normalizeRoleValue(role))
    .filter((role): role is AppRole => isAppRole(role));
};

export const getUserRoles = (profile?: Record<string, unknown> | null): AppRole[] => {
  if (!profile) {
    return [];
  }

  const roleCandidates = [
    ...extractRoleValues(profile["cognito:groups"] as ProfileValue),
    ...extractRoleValues(profile.groups as ProfileValue),
    ...extractRoleValues(profile.roles as ProfileValue),
    ...extractRoleValues(profile.role as ProfileValue),
    ...extractRoleValues(profile["custom:role"] as ProfileValue),
  ];

  return Array.from(new Set(roleCandidates));
};

export const hasAnyRole = (
  profile: Record<string, unknown> | undefined | null,
  allowedRoles: readonly AppRole[]
) => getUserRoles(profile).some((role) => allowedRoles.includes(role));
export enum RoleType {
  ADMIN = 1,
  USER = 2,
  MODERATOR = 3,
}

export const RoleNames = {
  [RoleType.ADMIN]: 'ADMIN',
  [RoleType.USER]: 'USER',
  [RoleType.MODERATOR]: 'MODERATOR',
};

export const DEFAULT_ROLE_ID = RoleType.USER;

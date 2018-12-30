import { Maybe } from '../@types';

export enum UserRoles {
  OWNER = 0x1,
  ADMIN = 0x2,
}

export const minRole = 1;
export const maxRole = 2;

export const userRoleNames = Object.keys(UserRoles).filter(
  r => Number.isNaN(Number.parseInt(r, 10))
);

export interface IUser {
  userId: string;
  email: string;
  role: UserRoles;
  name: string;
  longitude?: number | null;
  latitude?: number | null;
}

export interface IPasswordUser extends IUser {
  password: Maybe<string>;
}

export function userRoleToObject(user?: IUser) {
  if (!user || !user.role) {
    return userRoleNames.reduce((obj, roleName) => {
      obj[roleName] = false;
      return obj;
    }, {} as Record<string, boolean>);
  }
  const roles = {} as {[role: string]: boolean};
  for (let i = 1; i <= maxRole; i <<= 1) {
      roles[UserRoles[i]] = !!(user.role & i);
  }
  return roles;
}

export function userRoleFromObject(obj: {[role: string]: boolean}) {
  let role = 0 as UserRoles;
  for (let i = 1; i <= maxRole; i <<= 1) {
    if (obj[UserRoles[i]]) {
      role |= i;
    }
  }
  return role;
}

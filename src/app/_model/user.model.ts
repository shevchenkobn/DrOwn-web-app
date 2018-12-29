import { Maybe } from '../@types';

export enum UserRoles {
  CUSTOMER = 0x1,
  OWNER = 0x2,
  ADMIN = 0x4,
}

export const minRole = 1;
export const maxRole = 4;

export interface IUser {
  userId: string;
  email: string;
  role: UserRoles;
  name: string;
  cash: string;
  longitude?: number | null;
  latitude?: number | null;
}

export interface IPasswordUser extends IUser {
  password: Maybe<string>;
}

export function userRoleToArray(user: IUser): UserRoles[] {
  const roles = [];
  for (let i = 1; i <= 0x10; i <<= 1) {
    if (user.role & i) {
      roles.push(i);
    }
  }
  return roles;
}

export function composeUserRoleFromArray(roles: UserRoles[]): UserRoles {
  let userRole = 0;
  for (const role of roles) {
    userRole |= role;
  }
  return userRole;
}

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
  cash: string;
  longitude?: number | null;
  latitude?: number | null;
}

export interface IPasswordUser extends IUser {
  password: Maybe<string>;
}

// export function userRoleToArray(user: IUser): UserRoles[] {
//   const roles = [];
//   for (let i = 1; i <= maxRole; i <<= 1) {
//     if (user.role & i) {
//       roles.push(i);
//     }
//   }
//   return roles;
// }
//
// export function composeUserRoleFromArray(roles: UserRoles[]): UserRoles {
//   let userRole = 0;
//   for (const role of roles) {
//     userRole |= role;
//   }
//   return userRole;
// }

export function userRoleToObject(user: IUser) {
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

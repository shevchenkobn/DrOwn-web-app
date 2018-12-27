export enum UserRoles {
  CUSTOMER = 0x1,
  OWNER = 0x2,
  LANDLORD = 0x4,
  PRODUCER = 0x8,
  ADMIN = 0x10,
}

export enum UserStatus {
  ACTIVE = 1,
  BLOCKED = 2,
}

export interface IUser {
  userId: string;
  email: string;
  role: UserRoles;
  name: string;
  cash: string;
  status: UserStatus;
  address?: string | null;
  phoneNumber?: string | null;
  longitude?: number | null;
  latitude?: number | null;
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

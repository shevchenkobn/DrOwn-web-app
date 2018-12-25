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

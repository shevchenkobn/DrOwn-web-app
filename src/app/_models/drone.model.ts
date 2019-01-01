import { Maybe } from '../@types';


export enum DroneStatus {
  UNAUTHORIZED = 0,
  OFFLINE = 1,
  IDLE = 2,
  WORKING = 3
}

export interface IDroneInput {
  deviceId: string;
  status?: DroneStatus;
  baseLongitude: Maybe<number>;
  baseLatitude: Maybe<number>;
  batteryPower: number;
  enginePower: number;
  loadCapacity: number;
  canCarryLiquids: boolean;
}

export interface IDrone extends IDroneInput {
  droneId: string;
  ownerId: string;
  status: DroneStatus;
  baseLatitude: number;
  baseLongitude: number;
}

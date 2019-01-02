export enum DroneRealtimeStatus {
  WAITING = 0,
  TAKING_CARGO = 1,
  RELEASING_CARGO = 2,
  MOVING = 3,
}

export interface IDroneMeasurement {
  deviceId: string;
  createdAt: Date;
  status: DroneRealtimeStatus;
  longitude: number;
  latitude: number;
  batteryCharge: number;
}

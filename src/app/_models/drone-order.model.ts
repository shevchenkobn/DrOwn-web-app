export enum DroneOrderAction {
  STOP_AND_WAIT = 0,
  MOVE_TO_LOCATION = 1,
  TAKE_CARGO = 2,
  RELEASE_CARGO = 3,
}

export const droneOrderActionNames = Object.keys(DroneOrderAction).filter(
a => Number.isNaN(Number.parseInt(a, 10))
);

export enum DroneOrderStatus {
  STARTED = 0,
  ERROR = 1,
  ENQUEUED = 2,
  SKIPPED = 3,
  DONE = 4,
  TOO_FAR_GEO = 5,
  HAS_LOAD = 6,
  HAS_NO_LOAD = 7,
}

export interface IDroneOrderInput {
  deviceId: string;
  action: DroneOrderAction;
  longitude?: number;
  latitude?: number;
}

export interface IDroneOrder extends IDroneOrderInput {
  droneOrderId: string;
  status?: DroneOrderStatus;
}

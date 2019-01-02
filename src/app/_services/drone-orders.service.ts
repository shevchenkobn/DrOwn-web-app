import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDroneOrder, IDroneOrderInput } from '../_models/drone-order.model';
import { Observable } from 'rxjs';
import { DronesService } from './drones.service';
import { switchMap } from 'rxjs/operators';

export type DeviceIds = { deviceId: string }[] | string[];

@Injectable({
  providedIn: 'root'
})
export class DroneOrdersService {
  public static SELECT_PARAM = [
    'droneOrderId',
    'deviceId',
    'status',
    'action',
    'longitude',
    'latitude'
  ].join(',');
  public static DRONE_ORDERS_BASE = '/drone-orders';

  protected _http: HttpClient;
  protected _drones: DronesService;

  constructor(http: HttpClient, drones: DronesService) {
    this._http = http;
    this._drones = drones;
  }

  getDroneOrders(ownerId: string): Observable<IDroneOrder[]>;
  // tslint:disable-next-line:unified-signatures
  getDroneOrders(deviceIds: DeviceIds): Observable<IDroneOrder[]>;
  getDroneOrders(deviceIdsOrOwnerId: DeviceIds | string) {
    if (typeof deviceIdsOrOwnerId === 'string') {
      return this._drones.getDrones(['deviceId']).pipe(
        switchMap(deviceIds => {
          return this.httpGetDroneOrders(deviceIds);
        })
      );
    }
    return this.httpGetDroneOrders(deviceIdsOrOwnerId);
  }

  createDrone(order: IDroneOrderInput, returnOrder: true): Observable<IDroneOrder>;
  createDrone(order: IDroneOrderInput, returnDrone?: false): Observable<null>;
  createDrone(order: IDroneOrderInput, returnDrone = false) {
    return this._http.post<IDroneOrderInput | null>(
      DroneOrdersService.DRONE_ORDERS_BASE,
      order,
      {
        params: returnDrone ? { select: DroneOrdersService.SELECT_PARAM } : {},
      },
    );
  }

  private httpGetDroneOrders(deviceIds: DeviceIds) {
    return this._http.get<IDroneOrder[]>(DroneOrdersService.DRONE_ORDERS_BASE, {
      params: {
        select: DroneOrdersService.SELECT_PARAM,
        'device-ids': getDeviceIdsParam(deviceIds),
      }
    });
  }
}

function getDeviceIdsParam(deviceIds: DeviceIds) {
  if (!deviceIds || deviceIds.length === 0) {
    throw new Error('Device IDs must be provided');
  }
  const deviceIdParams: string[] = typeof deviceIds[0] === 'string'
    ? deviceIds as string[]
    : (deviceIds as any as { deviceId: string }[]).map(({ deviceId }) => deviceId);
  return deviceIds.length > 1 ? deviceIdParams.join(',') : `${deviceIds[0]},${deviceIds[0]}`;
}

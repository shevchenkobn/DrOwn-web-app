import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDrone, IDroneInput } from '../_models/drone.model';
import { Observable } from 'rxjs';
import { Maybe } from '../@types';

@Injectable({
  providedIn: 'root',
})
export class DronesService {
  public static readonly DRONES_BASE = 'drones/';
  public static readonly DRONE_PARAMS = {
    select: [
      'droneId',
      'deviceId',
      'ownerId',
      'status',
      'baseLongitude',
      'baseLatitude',
      'batteryPower',
      'enginePower',
      'loadCapacity',
      'canCarryLiquids',
    ].join(','),
  };

  protected _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  getDrones(select?: Maybe<(keyof IDrone)[]>) {
    return this._http.get<IDrone[]>(DronesService.DRONES_BASE, {
      params: {
        select: select && select.length > 0 ? select : DronesService.DRONE_PARAMS.select,
      }
    });
  }

  getDrone(droneId: string) {
    return this._http.get<IDrone>(DronesService.DRONES_BASE + droneId, {
      params: DronesService.DRONE_PARAMS,
    });
  }

  deleteDrone(droneId: string, returnDrone: true): Observable<IDrone>;
  deleteDrone(droneId: string, returnDrone?: false): Observable<null>;
  deleteDrone(droneId: string, returnDrone = false) {
    return this._http.delete<IDrone | null>(
      DronesService.DRONES_BASE + droneId,
      {
        params: returnDrone ? DronesService.DRONE_PARAMS : {},
      },
    );
  }

  createDrone(drone: IDroneInput, returnDrone?: true): Observable<IDrone>;
  createDrone(drone: IDroneInput, returnDrone: false): Observable<null>;
  createDrone(drone: IDroneInput, returnDrone = true): Observable<IDrone | null> {
    return this._http.post<IDrone | null>(
      DronesService.DRONES_BASE,
      drone,
      {
        params: returnDrone ? DronesService.DRONE_PARAMS : {},
      },
    );
  }

  updateDrone(droneId: string, updateDrone: Partial<IDroneInput>, returnDrone: false): Observable<null>;
  updateDrone(droneId: string, updateDrone: Partial<IDroneInput>, returnDrone?: true): Observable<IDrone>;
  updateDrone(droneId: string, updateDrone: Partial<IDroneInput>, returnDrone = true) {
    return this._http.patch<IDrone | null>(
      DronesService.DRONES_BASE + droneId,
      updateDrone,
      {
        params: returnDrone ? DronesService.DRONE_PARAMS : {},
      }
    );
  }
}

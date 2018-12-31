import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDrone } from '../_model/drone.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DronesService {
  public static readonly DRONES_BASE = 'drones/';
  public static readonly DRONE_PARAMS = {
    select: [
      'droneId',
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

  getDrones() {
    return this._http.get<IDrone[]>(DronesService.DRONES_BASE, {
      params: DronesService.DRONE_PARAMS,
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

}

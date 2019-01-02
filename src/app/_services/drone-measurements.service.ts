import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { IDroneMeasurement } from '../_models/drone-measurement.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DroneMeasurementsService {
  public static SELECT_PARAM = [
    'deviceId',
    'createdAt',
    'status',
    'longitude',
    'latitude',
    'batteryCharge'
  ].join(',');
  public static DRONE_MEASUREMENTS_BASE = '/drone-measurements';

  protected _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  getMeasurements(deviceId: string): Observable<IDroneMeasurement[]> {
    return this._http.get<IDroneMeasurement[]>(DroneMeasurementsService.DRONE_MEASUREMENTS_BASE, {
      params: {
        select: DroneMeasurementsService.SELECT_PARAM,
        'device-ids': `${deviceId},${deviceId}`,
      }
    }).pipe(
      tap(measurements => {
        for (const measurement of measurements) {
          measurement.createdAt = new Date(measurement.createdAt);
        }
      })
    );
  }

  deleteMeasurements(deviceId: string, inBetween: [Date, Date]): Observable<null> {
    return this._http.delete<null>(DroneMeasurementsService.DRONE_MEASUREMENTS_BASE, {
      params: {
        'device-ids': `${deviceId},${deviceId}`,
        'created-at-limits': inBetween.map(d => d.toISOString()).join(',')
      }
    });
  }
}

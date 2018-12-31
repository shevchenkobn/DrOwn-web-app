import { Injectable } from '@angular/core';
import { IDrone } from '../_model/drone.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DronesService } from '../_services/drones.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DronesResolver implements Resolve<IDrone[]> {
  protected _drones: DronesService;

  constructor(dronesService: DronesService) {
    this._drones = dronesService;
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<IDrone[]> | Promise<IDrone[]> | IDrone[] {
    return this._drones.getDrones();
  }
}

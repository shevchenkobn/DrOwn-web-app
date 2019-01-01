import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IDrone } from '../_models/drone.model';
import { DronesService } from '../_services/drones.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isClientHttpError } from '../_services/error-codes';
import { getFullPath } from '../_utils';

@Injectable({
  providedIn: 'root'
})
export class DroneResolver implements Resolve<IDrone> {
  protected _drones: DronesService;
  protected _router: Router;

  constructor(dronesService: DronesService, router: Router) {
    this._drones = dronesService;
    this._router = router;
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<IDrone> | Promise<IDrone> | IDrone {
    return this._drones.getDrone(route.params['id']).pipe(
      catchError((err: unknown) => {
        if (isClientHttpError(err) && (err.status === 404 || err.status === 400)) {
          this._router.navigate(['not-found'], {
              queryParams: {
                url: getFullPath(route.pathFromRoot, false)
              }
            })
            .catch(navError => {
              console.error('From drone resolve navigate', navError);
            });
          return of(null as any);
        }
        return throwError(err);
      })
    );
  }
}

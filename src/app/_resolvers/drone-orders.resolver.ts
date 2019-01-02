import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IDroneOrder } from '../_models/drone-order.model';
import { DroneOrdersService } from '../_services/drone-orders.service';
import { Observable, of, throwError } from 'rxjs';
import { DronesService } from '../_services/drones.service';
import { catchError } from 'rxjs/operators';
import { isClientHttpError } from '../_services/error-codes';
import { getFullPath } from '../_utils';

@Injectable({
  providedIn: 'root'
})
export class DroneOrdersResolver implements Resolve<IDroneOrder[]> {
  protected _droneOrders: DroneOrdersService;
  protected _router: Router;

  constructor(droneOrders: DroneOrdersService, router: Router) {
    this._droneOrders = droneOrders;
    this._router = router;
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<IDroneOrder[]> | Promise<IDroneOrder[]> | IDroneOrder[] {
    // getting orders for specific drone
    return this._droneOrders.getDroneOrders([route.params['id']]).pipe(
      catchError((err: unknown) => {
        if (isClientHttpError(err) && (err.status === 404 || err.status === 400)) {
          this._router.navigate(['not-found'], {
              queryParams: {
                url: getFullPath(route.pathFromRoot, false)
              }
            })
            .catch(navError => {
              console.error('From droneOrders resolve navigate', navError);
            });
          return of(null as any);
        }
        return throwError(err);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { IUser } from '../_model/user.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../_services/users.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isClientHttpError } from '../_services/error-codes';
import { getFullPath } from '../_utils';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<IUser> {
  protected _users: UsersService;
  protected _router: Router;

  constructor(usersService: UsersService, router: Router) {
    this._users = usersService;
    this._router = router;
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<IUser> | Promise<IUser> | IUser {
    return this._users.getUser(route.params['id']).pipe(
      catchError((err: any) => {
        if (isClientHttpError(err) && (err.status === 404 || err.status === 400)) {
          this._router.navigate(['not-found'], {
            queryParams: {
              url: getFullPath(route.pathFromRoot, false)
            }
          })
            .catch(navError => {
              console.error('From user resolve navigate', navError);
            });
          return of(null as any);
        }
        return throwError(err);
      }),
    );
  }
}

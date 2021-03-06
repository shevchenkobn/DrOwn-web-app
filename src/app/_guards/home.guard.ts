import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser, UserRoles } from '../_models/user.model';
import { AuthService } from '../_auth/auth.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  protected _auth: AuthService;
  protected _router: Router;

  constructor(authService: AuthService, router: Router) {
    this._auth = authService;
    this._router = router;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._auth.hasUser()) {
      return this._auth.refreshUser().pipe(
        map(user => this.routeByRole(user)),
      );
    }
    return this.routeByRole(this._auth.getUser());
  }

  private routeByRole(user: IUser) {
    if (user.role & UserRoles.ADMIN) {
      this.redirect('/users');
    } else if (
      user.role & UserRoles.OWNER
    ) {
      this.redirect('/home/drones');
    }
    return false;
  }

  private redirect(path: string) {
    this._router.navigateByUrl(path).catch(err => {
      console.error('From HomeGuard error ', err);
    });
  }
}

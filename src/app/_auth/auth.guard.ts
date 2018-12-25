import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild, UrlTree, Router, UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IUser, UserRoles } from '../../_model/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  protected _auth: AuthService;
  protected _router: Router;

  constructor(authService: AuthService, router: Router) {
    this._auth = authService;
    this._router = router;
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthAndRole(next);
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthAndRole(next);
  }

  private checkAuthAndRole(next: ActivatedRouteSnapshot) {
    if (!this._auth.isLoggedIn()) {
      this.redirectToLogin(next);
      return false;
    }
    const requiredRoles = next.data['authRoles'] as UserRoles;
    if (this._auth.hasUser()) {
      return this.checkRole(this._auth.getUser(), requiredRoles);
    }
    return this._auth.refreshUser().pipe(
      map(user => this.checkRole(user, requiredRoles)),
    );
  }

  private redirectToLogin(next: ActivatedRouteSnapshot) {
    this._auth.redirectUrl = next.url;
    this.navigate(AuthService.LOGIN_ROUTE);
  }

  private navigate(path: string) {
    this._router.navigate([path]).catch(reason => {
      console.error('From AuthGuard: ', reason);
    });
  }

  private checkRole(user: IUser, requiredRoles: UserRoles) {
    if (user.role & requiredRoles) {
      return true;
    }
    this.navigate('/');
    return false;
  }
}

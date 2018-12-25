import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoles } from '../../_model/user.model';
import { AuthService } from '../_auth/auth.service';

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
    const user = this._auth.getUser();
    if (user.role & UserRoles.ADMIN) {
      this.redirect('/users');
    } else if (
      user.role & UserRoles.OWNER
      || user.role & UserRoles.PRODUCER
      || user.role & UserRoles.LANDLORD
    ) {
      this.redirect('/home/drones');
    } else if (user.role & UserRoles.CUSTOMER) {
      this.redirect('/drones');
    }
    return false;
  }

  private redirect(path: string) {
    this._router.navigateByUrl(path).catch(err => {
      console.error('From HomeGuard error ', err);
    });
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IUser } from '../_model/user.model';
import { UsersService } from '../_services/users.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersResolver implements Resolve<IUser[]> {
  protected _users: UsersService;

  constructor(users: UsersService) {
    this._users = users;
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<IUser[]> | Promise<IUser[]> | IUser[] {
    return this._users.getUsers();
  }
}

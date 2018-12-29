import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPasswordUser, IUser } from '../_model/user.model';

export interface IUserId {
  userId?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public static readonly USERS_BASE = 'users/';
  public static readonly PARAMS: Readonly<{[name: string]: string | string[]}> = {
    'select': ['email', 'role', 'name', 'latitude', 'longitude', 'cash', 'userId'].join(','),
  };

  protected _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  updateUser(userId: IUserId, updateUser: Partial<IPasswordUser>, includePassword = false) {
    const params = {
      ...UsersService.PARAMS
    };
    if (includePassword) {
      params.select += ',password';
    }
    if (userId.userId) {
      return this._http.patch<IPasswordUser>(UsersService.USERS_BASE + userId.userId, updateUser, {
        params,
      });
    } else if (userId.email) {
      return this._http.patch<IPasswordUser>(UsersService.USERS_BASE, updateUser, {
        params: {
          ...params,
          email: userId.email,
        }
      });
    } else {
      throw new Error('Neither userId nor email were provided');
    }
  }
}

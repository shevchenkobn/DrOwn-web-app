import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPasswordUser, IUser } from '../_models/user.model';
import { Observable } from 'rxjs';

export interface IUserId {
  userId?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public static readonly USERS_BASE = 'users/';
  public static readonly PARAMS: Readonly<{ [name: string]: string | string[] }> = {
    'select': ['userId', 'email', 'role', 'name', 'latitude', 'longitude'].join(','),
  };

  protected _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  getUsers() {
    return this._http.get<IUser[]>(UsersService.USERS_BASE);
  }

  getUser(userId: string) {
    return this._http.get<IUser>(UsersService.USERS_BASE + userId, {
      params: {
        ...UsersService.PARAMS,
      }
    });
  }

  createUser(user: IPasswordUser, returnUser: true): Observable<IUser>;
  createUser(user: IPasswordUser, returnUser?: false): Observable<null>;
  createUser(user: IUser | (IUser & { password: '' }), returnUser: true): Observable<IPasswordUser>;
  createUser(user: IPasswordUser, returnUser = false) {
    const params: Record<string, string | string[]> = returnUser ? {
      ...UsersService.PARAMS,
    } : {};
    if (!user.password) {
      user.password = '';
      params.select += ',password';
    }
    return this._http.post<IUser | null>(UsersService.USERS_BASE, user, {
      params
    });
  }

  updateUser(userId: IUserId, updateUser: Partial<IUser & { password: '' }>, includePassword: true): Observable<IPasswordUser>;
  updateUser(userId: IUserId, updateUser: Partial<IPasswordUser>, includePassword?: false): Observable<IUser>;
  updateUser(userId: IUserId, updateUser: Partial<IPasswordUser>, includePassword = false) {
    const params = {
      ...UsersService.PARAMS,
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
        },
      });
    } else {
      throw new Error('Neither userId nor email were provided');
    }
  }

  deleteUser(userId: IUserId, returnUser: true): Observable<IUser>;
  deleteUser(userId: IUserId, returnUser?: false): Observable<null>;
  deleteUser(userId: IUserId, returnUser = false): Observable<IUser | null> {
    const params: Record<string, string | string[]> = returnUser ? {
      ...UsersService.PARAMS,
    } : {};
    if (returnUser) {
      if (userId.userId) {
        return this._http.delete<IUser>(UsersService.USERS_BASE + userId.userId, {
          params,
        });
      } else if (userId.email) {
        params.email = userId.email;
        return this._http.delete<IUser>(UsersService.USERS_BASE, {
          params,
        });
      } else {
        throw new Error('Neither userId nor email were provided');
      }
    } else {
      if (userId.userId) {
        return this._http.delete<null>(UsersService.USERS_BASE + userId.userId, {
          params,
        });
      } else {
        params.email = userId.email as string;
        return this._http.delete<null>(UsersService.USERS_BASE, {
          params,
        });
      }
    }
  }
}

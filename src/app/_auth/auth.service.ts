import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUrlHelper } from '../_http/http-url.helper';
import { JwtHelperService } from '@auth0/angular-jwt';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { IPasswordUser, IUser, UserRoles } from '../_models/user.model';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from '../_services/users.service';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static readonly LOCAL_STORAGE_ACCESS_TOKEN = 'accessToken';
  public static readonly LOCAL_STORAGE_REFRESH_TOKEN = 'refreshToken';
  public static readonly LOCAL_STORAGE_USER = 'user';

  public static readonly AUTH_BASE_PATH = '/auth';
  public static readonly AUTH_LOGIN_PATH = AuthService.AUTH_BASE_PATH;
  public static readonly AUTH_REFRESH_PATH = AuthService.AUTH_BASE_PATH + '/refresh';
  public static readonly AUTH_REGISTER_PATH = AuthService.AUTH_BASE_PATH + '/register';
  public static readonly PROFILE_PATH = AuthService.AUTH_BASE_PATH + '/profile';
  public static readonly NO_AUTH_PATHS: ReadonlyArray<[string, ReadonlyArray<string>?, boolean?]> = [
    [HttpUrlHelper.getUrl(AuthService.AUTH_REFRESH_PATH), undefined, true],
    [HttpUrlHelper.getUrl(AuthService.AUTH_REGISTER_PATH), undefined, true],
    [HttpUrlHelper.getUrl(AuthService.AUTH_LOGIN_PATH), undefined, true],
  ];

  public static readonly LOGIN_ROUTE = '/login';

  protected readonly _http: HttpClient;
  protected _email = '';
  protected _login$?: Observable<string>;
  protected _tokenUpdate$?: Observable<string>;
  protected _user?: Readonly<IUser>;
  public readonly jwt: JwtHelperService;
  public redirectUrl?: ActivatedRouteSnapshot[];

  public onLoginChange: Observable<boolean>;
  public onTokenRefresh: Observable<string>;
  public onUserRefresh: Observable<Readonly<IUser> | undefined>;
  protected _onLoginChange: Subject<boolean>;
  protected _onTokenRefresh: Subject<string>;
  protected _onUserRefresh: Subject<Readonly<IUser> | undefined>;

  public static getAccessToken() {
    return localStorage.getItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN);
  }

  constructor(http: HttpClient) {
    this._http = http;
    this.jwt = new JwtHelperService({
      tokenGetter: AuthService.getAccessToken,
    });

    this._onLoginChange = new Subject<boolean>();
    this.onLoginChange = this._onLoginChange.asObservable();
    this._onTokenRefresh = new Subject<string>();
    this.onTokenRefresh = this._onTokenRefresh.asObservable();
    this._onUserRefresh = new Subject<Readonly<IUser> | undefined>();
    this.onUserRefresh = this._onUserRefresh.asObservable();
  }

  public refreshToken() {
    if (this._tokenUpdate$) {
      return this._tokenUpdate$;
    }
    const refreshToken = localStorage.getItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN);
    const accessToken = AuthService.getAccessToken();
    if (!refreshToken || !accessToken) {
      throw new Error('Needs login');
    }
    this._tokenUpdate$ = this._http.post<Tokens>(AuthService.AUTH_REFRESH_PATH, {
      accessToken,
      refreshToken,
    }, { observe: 'body' }).pipe(
      finalize(() => {
        this._tokenUpdate$ = undefined;
      }),
      tap(tokens => {
        localStorage.setItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN, tokens.accessToken);

        this._onTokenRefresh.next(tokens.accessToken);
      }),
      map(tokens => tokens.accessToken),
      shareReplay()
    );
    return this._tokenUpdate$;
  }

  public isLoggedIn() {
    return localStorage.getItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN) !== null
      && localStorage.getItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN) !== null;
  }

  public login(email: string, password: string) {
    if (this._login$) {
      if (email !== this._email) {
        throw new Error(`Login for ${this._email} is in process`);
      }
      return this._login$;
    }

    const refreshToken = localStorage.getItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN);
    const accessToken = AuthService.getAccessToken();
    if (refreshToken || accessToken) {
      throw new Error('No login needed');
    }

    this._email = email;
    this._login$ = this._http.post<Tokens>(AuthService.AUTH_LOGIN_PATH, {
      email,
      password,
    }, { observe: 'body' }).pipe(
      finalize(() => {
        this._email = '';
        this._login$ = undefined;
      }),
      tap(tokens => {
        localStorage.setItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN, tokens.accessToken);
        this._onLoginChange.next(true);
      }),
      map(tokens => tokens.accessToken),
      shareReplay(),
    );
    return this._login$;
  }

  public logout() {
    localStorage.removeItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(AuthService.LOCAL_STORAGE_USER);
    this._user = undefined;
    this._onUserRefresh.next(undefined);
    this._onLoginChange.next(false);
  }

  public hasUser() {
    return localStorage.getItem(AuthService.LOCAL_STORAGE_USER) !== null;
  }

  public getUser() {
    if (this._user) {
      return this._user;
    }
    const userJson = localStorage.getItem(AuthService.LOCAL_STORAGE_USER);
    if (!userJson) {
      throw new Error('User is not found');
    }
    this._user = JSON.parse(userJson) as IUser;
    return this._user;
  }

  public refreshUser() {
    if (!this.isLoggedIn()) {
      throw new Error('Needs login');
    }
    return this._http.get<IUser>(AuthService.PROFILE_PATH).pipe(
      tap(user => {
        localStorage.setItem(AuthService.LOCAL_STORAGE_USER, JSON.stringify(user));
        this._user = user;
        this._onUserRefresh.next(user);
      }),
      shareReplay()
    );
  }

  public setUser(user: IUser) {
    if (!this.isLoggedIn()) {
      throw new Error('Not logged in, cannot set localUser');
    }
    this._user = user;
    this._onUserRefresh.next(user);
  }

  register(user: IPasswordUser, returnUser: true): Observable<IUser>;
  register(user: IPasswordUser, returnUser?: false): Observable<null>;
  public register(user: IPasswordUser, returnUser = false) {
    if (!user.password) {
      throw new Error('Password is required for registration');
    }
    const params: Record<string, string | string[]> = returnUser ? {
      ...UsersService.PARAMS,
    } : {};
    return this._http.post<IUser | null>(AuthService.AUTH_REGISTER_PATH, user, {
      params
    });
  }
}

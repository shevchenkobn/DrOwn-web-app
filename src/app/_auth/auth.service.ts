import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUrlHelper } from '../_http/http-url.helper';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

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
  public static readonly DRONES_PATH = '/drones';
  public static readonly DRONE_PRICES_PATH = '/drone-prices';
  // FIXME: check if droons should be added
  // public static readonly NO_AUTH_PATHS = [
  //   AuthService.AUTH_LOGIN_PATH,
  //   AuthService.AUTH_REFRESH_PATH,
  //   AuthService.AUTH_REGISTER_PATH,
  //   AuthService.DRONE_PRICES_PATH,
  //   AuthService.DRONES_PATH,
  // ];
  public static readonly NO_AUTH_PATHS: ReadonlyArray<[string, ReadonlyArray<string>?]> = [
    [HttpUrlHelper.getUrl(AuthService.DRONES_PATH), ['GET']],
    [HttpUrlHelper.getUrl(AuthService.DRONE_PRICES_PATH), ['GET']],
    [HttpUrlHelper.getUrl(AuthService.AUTH_BASE_PATH)],
  ];

  protected readonly _http: HttpClient;
  protected _email = '';
  protected _login$?: Observable<string>;
  protected _tokenUpdate$?: Observable<string>;
  public readonly jwt: JwtHelperService;

  public static getAccessToken() {
    return localStorage.getItem(this.LOCAL_STORAGE_ACCESS_TOKEN);
  }

  constructor(http: HttpClient) {
    this._http = http;
    this.jwt = new JwtHelperService({
      tokenGetter: AuthService.getAccessToken,
    });
  }

  public updateToken() {
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
      tap(tokens => {
        localStorage.setItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN, tokens.accessToken);
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

    this._login$ = this._http.post<Tokens>(AuthService.AUTH_LOGIN_PATH, {
      email,
      password,
    }, { observe: 'body' }).pipe(
      tap(tokens => {
        this._email = '';
        this._login$ = undefined;
        localStorage.setItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN, tokens.accessToken);
      }),
      map(tokens => tokens.accessToken),
      shareReplay(),
    );
    return this._login$;
  }

  public logout() {
    localStorage.removeItem(AuthService.LOCAL_STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(AuthService.LOCAL_STORAGE_ACCESS_TOKEN);
  }

  // TODO: add update user
}

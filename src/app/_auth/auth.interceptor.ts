import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ServerErrorCode } from '../_services/error-codes';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private _auth: AuthService;

  constructor(authService: AuthService) {
    this._auth = authService;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthService.NO_AUTH_PATHS.some(([path, methods]) => (
      req.url.startsWith(path) && (!methods || methods.includes(req.method))
    ))) {
      return next.handle(req);
    }
    const request = this.addAuthHeader(req);
    return next.handle(request).pipe(
      catchError(err => {
        if (
          err instanceof HttpErrorResponse
          && (
            err.status === 401 || (
              err.status === 403
              && err.error && err.error.code === ServerErrorCode.AUTH_EXPIRED
            )
          )
        ) {
          return this._auth.refreshToken().pipe(
            switchMap(() => next.handle(this.addAuthHeader(request))),
          );
        }
        return throwError(err);
      }),
    );
  }

  private addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${this._auth.jwt.tokenGetter()}`,
      }
    });
  }
}

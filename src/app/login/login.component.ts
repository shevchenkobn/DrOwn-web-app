import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { Router } from '@angular/router';
import { L10nService } from '../_services/l10n.service';
import { getFullPath } from '../_utils';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { isClientHttpError } from '../_services/error-codes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  protected _auth: AuthService;
  protected _router: Router;
  protected _snackBar: MatSnackBar;
  protected _lastSnackBar?: MatSnackBarRef<SimpleSnackBar>;
  protected _redirectUrl = '';

  public l10n: L10nService;
  public email = '';
  public password = '';
  public redirectWrap = {
    redirect: '',
  };
  public isSendingRequest = false;

  constructor(
    authService: AuthService,
    router: Router,
    l10nService: L10nService,
    snackBar: MatSnackBar,
  ) {
    this._auth = authService;
    this._router = router;
    this.l10n = l10nService;
    this._snackBar = snackBar;
  }

  submit() {
    this._auth.login(this.email, this.password).pipe(
      finalize(() => {
        this.isSendingRequest = false;
      })
    ).subscribe(
      () => {
        if (this._lastSnackBar) {
          this._lastSnackBar.dismiss();
        }
        this._router.navigateByUrl(this._redirectUrl).catch(err => {
          console.error('Navigate from login page: ', err);
        });
      },
      err => {
        const msg = isClientHttpError(err)
          ? 'login-page.error.client-msg'
          : 'errors.network';
        console.error(err);
        this.l10n.translate.get([msg, 'dialog.ok']).subscribe(
          translations => {
            if (this._lastSnackBar) {
              this._lastSnackBar.dismiss();
            }
            this._lastSnackBar = this._snackBar
              .open(translations[msg], translations['dialog.ok']);
          }
        );
      }
    );
    this.password = '';
    this.isSendingRequest = true;
  }

  protected updateRedirectUrl() {
    this._redirectUrl = this._auth.redirectUrl ? getFullPath(this._auth.redirectUrl, false) : '/';
  }

  protected setRedirectMessage() {
    if (this._auth.redirectUrl) {
      this.redirectWrap.redirect = `<strong>${this._redirectUrl}</strong>`;
    } else {
      this.l10n.translate.onLangChange.subscribe(() => {
        this.updateRedirectMessage();
      });
      this.updateRedirectMessage();
    }
  }

  protected updateRedirectMessage() {
    this.l10n.translate.get('login-page.home').subscribe(translation => {
      this.redirectWrap.redirect = translation;
    });
  }

  ngOnInit() {
    this.updateRedirectUrl();
    this.setRedirectMessage();
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

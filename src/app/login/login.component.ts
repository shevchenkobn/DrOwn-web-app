import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { Router } from '@angular/router';
import { L10nService } from '../_services/l10n.service';
import { getFullPath } from '../_utils';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    this._auth.login(this.email, this.password).subscribe(
      () => {
        if (this._lastSnackBar) {
          this._lastSnackBar.dismiss();
        }
        this._router.navigateByUrl(this._redirectUrl).catch(err => {
          console.error('Navigate from login page: ', err);
        });
      },
      err => {
        console.error(err);
        this.l10n.translate.get(['login-page.error.msg', 'login-page.error.ok']).subscribe(
          translations => {
            if (this._lastSnackBar) {
              this._lastSnackBar.dismiss();
            }
            this._lastSnackBar = this._snackBar
              .open(translations['login-page.error.msg'], translations['login-page.error.ok']);
          }
        );
      },
      () => {
        this.isSendingRequest = false;
      },
    );
    this.password = '';
    this.isSendingRequest = true;
  }

  ngOnInit() {
    this.updateRedirectUrl();
    this.updateRedirectMessage();
  }

  protected updateRedirectUrl() {
    this._redirectUrl = this._auth.redirectUrl ? getFullPath(this._auth.redirectUrl) : '/home';
  }

  protected updateRedirectMessage() {
    if (this._auth.redirectUrl) {
      this.redirectWrap.redirect = `<strong>${this._redirectUrl}</strong>`;
    } else {
      this.l10n.translate.get('login-page.home').subscribe(translation => {
        this.redirectWrap.redirect = translation;
      });
    }
  }
}

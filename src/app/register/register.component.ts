import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { IUserCreateInfo } from '../user-create-core/user-create-core.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { L10nService } from '../_services/l10n.service';
import { Router } from '@angular/router';
import { newUserOnErrorMessage } from '../_utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  protected _auth: AuthService;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;
  protected _router: Router;

  public isMakingRequest!: boolean;

  constructor(
    auth: AuthService,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
    router: Router,
  ) {
    this._auth = auth;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
    this._router = router;
  }

  register({ user: newUser }: IUserCreateInfo) {
    this.isMakingRequest = true;
    this._auth.register(newUser).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      () => {
        this._dialog.open(InfoDialogComponent, {
          data: {
            message: 'register.done',
          },
          autoFocus: false,
        }).afterClosed().subscribe(
          () => {
            this._l10n.translate.get(['register.login', 'dialog.ok']).subscribe(
              ({ 'register.login': message, 'dialog.ok': ok }) => {
                this._snackBar.open(message, ok);
                this._router.navigateByUrl('/login').catch(err => {
                  console.error('From register-login redirect', err);
                });
              },
            );
          }
        );
      },
      err => {
        const msg = newUserOnErrorMessage(err);
        this._l10n.translate.get([msg, 'dialog.ok']).subscribe(
          (translations) => {
            this._snackBar.open(translations[msg], translations['dialog.ok']);
          }
        );
      }
    );
  }

  ngOnInit() {
    this.isMakingRequest = false;
  }

}

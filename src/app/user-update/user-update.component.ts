import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../_services/users.service';
import { IUser } from '../_model/user.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { finalize } from 'rxjs/operators';
import { userUpdateOnErrorMessage } from '../_utils';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ShowPasswordDialogComponent } from '../show-password-dialog/show-password-dialog.component';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit, OnDestroy {
  protected _route: ActivatedRoute;
  protected _users: UsersService;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public user!: Readonly<IUser>;
  public isMakingRequest!: boolean;

  constructor(
    route: ActivatedRoute,
    usersService: UsersService,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._route = route;
    this._users = usersService;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  updateUser(updateUser: Partial<IUser>) {
    this.isMakingRequest = true;
    this._users.updateUser({ userId: this.user.userId }, updateUser)
      .pipe(
        finalize(() => {
          this.isMakingRequest = false;
        })
      )
      .subscribe(
        user => {
          this.user = user;
          this._l10n.translate.get(['users.edit.done', 'dialog.ok-good']).subscribe(
            ({'users.edit.done': message, 'dialog.ok-good': ok}) => {
              this._snackBar.open(message, ok);
            }
          );
        },
        err => {
          const [msg, replacer] = userUpdateOnErrorMessage(err, 'users.edit.errors.', updateUser.email);
          this._l10n.translate.get([msg, 'dialog.ok']).subscribe(
            translations => {
              this._snackBar
                .open(
                  replacer ? replacer(translations[msg]) : translations[msg],
                  translations['dialog.ok'],
                );
            }
          );
        }
      );
  }

  resetPassword() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'users.edit.password.reset-q'
      },
      autoFocus: false
    }).afterClosed().subscribe((yes: boolean) => {
      if (yes) {
        this.isMakingRequest = true;
        this._users.updateUser({ userId: this.user.userId }, { password: '' }, true)
          .pipe(
            finalize(() => {
              this.isMakingRequest = false;
            })
          )
          .subscribe(user => {
            const password = user.password;
            delete user.password;
            this.isMakingRequest = true;
            this.user = user;
            this._dialog.open(ShowPasswordDialogComponent, {
              data: {
                password,
                fromProfile: false
              },
              autoFocus: false
            });
          });
      }
    });
  }

  changePassword() {
    this._dialog.open(PasswordChangeDialogComponent, {
      autoFocus: false
    }).afterClosed().subscribe((password: string) => {
      if (!password) {
        return;
      }
      this.isMakingRequest = true;
      this._users.updateUser({ userId: this.user.userId }, { password })
        .pipe(
          finalize(() => {
            this.isMakingRequest = false;
          })
        )
        .subscribe(user => {
          this.user = user;
          this._l10n.translate.get(['users.edit.password.update.done', 'dialog.ok-good']).subscribe(
            translations => {
              this._snackBar.open(
                translations['users.edit.password.update.done'],
                translations['dialog.ok-good']
              );
            }
          );
        });
    });
  }

  ngOnInit() {
    this.user = this._route.snapshot.data['user'];
    this.isMakingRequest = false;
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

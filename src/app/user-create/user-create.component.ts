import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IUser,
} from '../_model/user.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import {
  getCommonErrorMessage,
  isClientHttpError,
  ServerErrorCode,
} from '../_services/error-codes';
import { L10nService } from '../_services/l10n.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ShowPasswordDialogComponent } from '../show-password-dialog/show-password-dialog.component';
import { IUserCreateInfo } from '../user-create-core/user-create-core.component';
import { newUserOnErrorMessage } from '../_utils';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  protected _route: ActivatedRoute;
  protected _users: UsersService;
  protected _router: Router;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public isMakingRequest!: boolean;

  constructor(
    route: ActivatedRoute,
    usersService: UsersService,
    router: Router,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10nService: L10nService,
  ) {
    this._route = route;
    this._users = usersService;
    this._router = router;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10nService;
  }

  public createUser({user: newUser, generatedPassword}: IUserCreateInfo) {
    this.isMakingRequest = true;
    console.log(newUser);
    this._users.createUser(newUser as IUser, generatedPassword as true).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      (user) => {
        if (generatedPassword) {
          this._dialog.open(ShowPasswordDialogComponent, {
            data: {
              password: user.password,
              fromProfile: false,
            },
          }).afterClosed().subscribe(() => {
            this.showLastDialog();
          });
        } else {
          this.showLastDialog();
        }
      },
      err => {
        const msg = newUserOnErrorMessage(err);
        this._l10n.translate.get([msg, 'dialog.ok']).subscribe(
          (translations) => {
            this._snackBar.open(translations[msg], translations['dialog.ok']);
          }
        );
      },
    );
  }

  private showLastDialog() {
    this._dialog.open(InfoDialogComponent, {
      data: {
        message: 'users.create.done',
      },
      autoFocus: false,
    }).afterClosed().subscribe(() => {
      this._router.navigate(['../'], { relativeTo: this._route }).catch(
        err => {
          console.error('From localUser create -> navigate to users', err);
        },
      );
    });
  }

  ngOnInit() {
    this.isMakingRequest = false;
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

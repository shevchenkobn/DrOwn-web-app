import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { ActivatedRoute } from '@angular/router';
import { IUser, userRoleNames, userRoleToObject } from '../_model/user.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize, switchMap } from 'rxjs/operators';
import {
  getCommonErrorMessage,
  isClientHttpError,
  ServerErrorCode,
} from '../_services/error-codes';
import { L10nService } from '../_services/l10n.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  protected _users: UsersService;
  protected _route: ActivatedRoute;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public isMakingRequest!: boolean;
  public roleNames = userRoleNames;
  public userRoles!: ({ [role: string]: boolean })[];
  public users!: IUser[];

  public currentUser!: IUser;
  public readonly MASTER_ADMIN_ID = '1';

  public columnsToDisplay = ['name', 'email', 'role', 'details', 'delete'];

  constructor(
    users: UsersService,
    route: ActivatedRoute,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._users = users;
    this._route = route;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  public deleteUser(userId: string) {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'users.delete-q'
      },
      autoFocus: false
    }).afterClosed().subscribe(yes => {
      if (!yes) {
        return;
      }
      this._users.deleteUser({ userId }).pipe(
        switchMap(() => {
          return this._users.getUsers();
        }),
        finalize(() => {
          this.isMakingRequest = false;
        }),
      ).subscribe(
        (users) => {
          this.saveUsers(users);
          this._l10n.translate.get(['users.deleted', 'dialog.ok']).subscribe(
            ({'users.deleted': msg, 'dialog.ok': ok}) => {
              this._snackBar.open(msg, ok);
            }
          );
        },
        (err: any) => {
          let msg: string;
          if (isClientHttpError(err)) {
            msg = getCommonErrorMessage(err);
            if (!msg) {
              const code = err.error.code as ServerErrorCode;
              if (code === ServerErrorCode.NOT_FOUND) {
                msg = 'users.errors.not-found';
              } else if (code === ServerErrorCode.AUTH_ROLE) {
                msg = 'users.errors.delete-not-allowed';
              } else {
                msg = 'errors.unknown';
              }
            }
          } else {
            msg = 'errors.network';
          }
          this._dialog.open(InfoDialogComponent, {
            data: {
              message: msg
            },
            autoFocus: false
          });
        },
      );
    });

  }

  ngOnInit() {
    this.saveUsers(this._route.snapshot.data['users'] as IUser[]);
    this.currentUser = this._route.snapshot.data['profile'];
    this.isMakingRequest = false;
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }

  private saveUsers(users: IUser[]) {
    this.users = users;
    this.userRoles = users.map(userRoleToObject);
  }
}

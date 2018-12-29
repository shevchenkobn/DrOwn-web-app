import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import {
  IUser,
  maxRole,
  minRole, userRoleFromObject,
  userRoleNames, userRoleToObject,
} from '../_model/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { decimalValidator } from '../_validators/number.validator';
import {
  MatDialog,
  MatDialogRef,
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material';
import { ProfilePasswordChangeComponent } from '../profile-password-change/profile-password-change.component';
import { UsersService } from '../_services/users.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProfileShowPasswordComponent } from '../profile-show-password/profile-show-password.component';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { L10nService } from '../_services/l10n.service';
import { ServerErrorCode } from '../_services/error-codes';
import { coordsValidator } from '../_validators/coordinates.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected _auth: AuthService;
  protected _users: UsersService;
  protected _fb: FormBuilder;
  protected _route: ActivatedRoute;
  protected _dialog: MatDialog;
  public l10n: L10nService;
  protected _snackBar: MatSnackBar;
  private onUserRefresh$!: Subscription;
  public passwordDialog?: MatDialogRef<ProfilePasswordChangeComponent, boolean>;

  public user!: Readonly<IUser>;
  public userRoles!: {[role: string]: boolean};
  public rolesNames = userRoleNames;
  public editMode!: boolean;
  public isMakingRequest!: boolean;
  public editUserGroup?: FormGroup;

  get controls() {
    return this.editUserGroup && this.editUserGroup.controls;
  }

  private _userSetter = (user: Readonly<IUser> | undefined) => {
    this.user = user as IUser;
  }

  constructor(
    authService: AuthService,
    users: UsersService,
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    dialog: MatDialog,
    l10n: L10nService,
    snackBar: MatSnackBar,
  ) {
    this._auth = authService;
    this._users = users;
    this._fb = formBuilder;
    this._route = route;
    this._dialog = dialog;
    this.l10n = l10n;
    this._snackBar = snackBar;
  }

  refreshUser() {
    this.isMakingRequest = true;
    this._auth.refreshUser().pipe(
      finalize(() => {
        this.isMakingRequest = false;
      })
    ).subscribe(user => {
      this.updateUser(user, false);
    });
  }

  switchMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.initializeForm();
    }
  }

  changePassword() {
    this.passwordDialog = this._dialog.open(ProfilePasswordChangeComponent);
    this._dialog.open(ProfilePasswordChangeComponent).afterClosed().subscribe((password: string) => {
      this.passwordDialog = undefined;
      this.isMakingRequest = true;
      this._users.updateUser({ userId: this.user.userId }, { password })
        .pipe(
          finalize(() => {
            this.isMakingRequest = false;
          })
        )
        .subscribe(user => {
          this.updateUser(user);
          this.l10n.translate.get(['profile.updated.password', 'profile.updated.ok']).subscribe(
            translations => {
              this._snackBar.open(
                translations['profile.updated.password'],
                translations['profile.updated.ok']
              );
            }
          );
        });
    });
  }

  toggleRole(roleName: string) {
    this.userRoles[roleName] = !this.userRoles[roleName];
  }

  updateProfile() {
    const form = this.editUserGroup as FormGroup;
    const emailControl = form.get('email') as FormControl;
    if (emailControl.dirty) {
      this._dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'profile.update.email-q'
        }
      }).afterClosed().subscribe(yes => {
        if (yes) {
          this.doUpdateProfile();
        }
      });
    } else {
      this.doUpdateProfile();
    }
  }

  private doUpdateProfile() {
    const updateUser: Partial<IUser> = this.getUserFromForm();
    this.isMakingRequest = true;
    this._users.updateUser({ userId: this.user.userId }, updateUser)
      .pipe(
        finalize(() => {
          {
            this.isMakingRequest = false;
          }
        })
      )
      .subscribe(
        user => {
          this.updateUser(user);
          this.l10n.translate.get(['profile.updated.msg', 'profile.updated.ok']).subscribe(
            translations => {
              this._snackBar.open(
                translations['profile.updated.msg'],
                translations['profile.updated.ok']
              );
            }
          );
        },
        err => {
          console.error(err);
          let msg: string;
          let replacer: ((str: string) => string) | null = null;
          if (err instanceof HttpErrorResponse && (err.status - (err.status % 100)) === 400) {
            switch (err.error.code as string) {
              case ServerErrorCode.USER_EMAIL_DUPLICATE:
                msg = 'profile.errors.email';
                replacer = msgTpl => msgTpl.replace('{{email}}', updateUser.email as string);
                break;

              case ServerErrorCode.NOT_FOUND:
                msg = 'profile.errors.not-found';
                break;

              default:
                msg = 'profile.errors.unknown';
            }
          } else {
            msg = 'errors.network';
          }
          this.l10n.translate.get([msg, 'errors.ok']).subscribe(
            translations => {
              this._snackBar
                .open(
                  replacer ? replacer(translations[msg]) : translations[msg],
                  translations['errors.ok'],
                );
            }
          );
        }
      );
  }

  private initializeForm() {
    if (!this.editUserGroup) {
      this.editUserGroup = this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        longitude: [''],
        latitude: [''],
        cash: ['', [Validators.required, decimalValidator]],
      }, { validators: [coordsValidator('longitude', 'latitude')] });
    }
    this.populateFormWithUser();
  }

  private populateFormWithUser() {
    this.userRoles = userRoleToObject(this.user);
    const form = this.editUserGroup as FormGroup;
    form.setValue(this.user);
  }

  private getUserFromForm() {
    const updateUser = {} as Partial<IUser>;
    const form = this.editUserGroup as FormGroup;

    const emailControl = form.get('email') as FormControl;
    if (emailControl.dirty) {
      updateUser.email = emailControl.value;
    }
    updateUser.role = userRoleFromObject(this.userRoles);
    const nameControl = form.get('name') as FormControl;
    if (nameControl.dirty) {
      updateUser.name = nameControl.value;
    }
    const longitudeControl = form.get('longitude') as FormControl;
    if (longitudeControl.dirty) {
      updateUser.longitude = Number.parseFloat(longitudeControl.value);
    }
    const latitudeControl = form.get('latitude') as FormControl;
    if (latitudeControl.dirty) {
      updateUser.latitude = Number.parseFloat(latitudeControl.value);
    }
    const cashControl = form.get('cash') as FormControl;
    if (cashControl.dirty) {
      updateUser.cash = cashControl.value;
    }
    return updateUser;
  }

  private updateUser(user: IUser, updateAuth = true) {
    this.user = user;
    this.userRoles = userRoleToObject(user);
    if (updateAuth) {
      this._auth.setUser(user);
    }
  }

  resetPassword() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'profile.password.reset-q'
      },
    }).afterClosed().subscribe((yes: boolean) => {
      if (yes) {
        this.isMakingRequest = true;
        this._users.updateUser({ userId: this.user.userId }, { password: '' })
          .subscribe(user => {
            const password = user.password;
            delete user.password;
            this.updateUser(user);
            this.isMakingRequest = false;
            this._dialog.open(ProfileShowPasswordComponent, {
              data: {
                password
              }
            });
          });
      }
    });
  }

  public ngOnInit() {
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(this._userSetter);
    this.updateUser(this._route.snapshot.data['profile'], false);
    this.editMode = false;
    this.isMakingRequest = false;
  }

  public ngOnDestroy() {
    this.onUserRefresh$.unsubscribe();
    this._snackBar.dismiss();
  }
}

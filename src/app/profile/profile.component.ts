import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import {
  IUser,
  userRoleFromObject,
  userRoleNames,
  UserRoles,
  userRoleToObject,
} from '../_model/user.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';
import { UsersService } from '../_services/users.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ShowPasswordDialogComponent } from '../show-password-dialog/show-password-dialog.component';
import { finalize } from 'rxjs/operators';
import { L10nService } from '../_services/l10n.service';
import { isClientHttpError, ServerErrorCode } from '../_services/error-codes';
import {
  coordsValidator,
  latitudeValidator,
  longitudeValidator,
} from '../_validators/coordinates.validator';
import { userUpdateOnErrorMessage } from '../_utils';
// 'profile.update.btn'
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
  protected _router: Router;
  public l10n: L10nService;
  protected _snackBar: MatSnackBar;
  private onUserRefresh$!: Subscription;

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
    router: Router,
  ) {
    this._auth = authService;
    this._users = users;
    this._fb = formBuilder;
    this._route = route;
    this._dialog = dialog;
    this.l10n = l10n;
    this._snackBar = snackBar;
    this._router = router;
  }

  isAdmin() {
    return this.user.role & UserRoles.ADMIN;
  }

  toggleRole(roleName: string) {
    this.userRoles[roleName] = !this.userRoles[roleName];
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
    // this.editMode = !this.editMode;
    this.populateFormWithUser();
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
          this.updateUser(user);
          this.l10n.translate.get(['profile.updated.password', 'dialog.ok-good']).subscribe(
            translations => {
              this._snackBar.open(
                translations['profile.updated.password'],
                translations['dialog.ok-good']
              );
            }
          );
        });
    });
  }

  updateProfile() {
    const form = this.editUserGroup as FormGroup;
    const emailControl = form.get('email') as FormControl;
    if (emailControl.dirty) {
      this._dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'users.edit.email-q'
        },
        autoFocus: false
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
          this.l10n.translate.get(['profile.updated.msg', 'dialog.ok-good']).subscribe(
            translations => {
              this._snackBar.open(
                translations['profile.updated.msg'],
                translations['dialog.ok-good']
              );
            }
          );
        },
        err => {
          const [msg, replacer] = userUpdateOnErrorMessage(err, 'profile.errors.', updateUser.email);
          this.l10n.translate.get([msg, 'dialog.ok']).subscribe(
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

  private initializeForm() {
    if (!this.editUserGroup) {
      this.editUserGroup = this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        longitude: ['', longitudeValidator],
        latitude: ['', latitudeValidator],
      }, {
        validators: [coordsValidator('longitude', 'latitude')],
        updateOn: 'change'
      });
    }
  }

  private populateFormWithUser() {
    this.userRoles = userRoleToObject(this.user);
    const form = this.editUserGroup as FormGroup;
    form.setValue({
      email: this.user.email,
      name: this.user.name,
      longitude: this.user.longitude,
      latitude: this.user.latitude
    });
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
    return updateUser;
  }

  private updateUser(user: IUser, updateAuth = true) {
    this.user = user;
    this.userRoles = userRoleToObject(user);
    if (this.editUserGroup) {
      this.populateFormWithUser();
    }
    if (updateAuth) {
      this._auth.setUser(user);
    }
  }

  resetPassword() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'profile.password.reset-q'
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
            this.updateUser(user);
            this.isMakingRequest = true;
            this._dialog.open(ShowPasswordDialogComponent, {
              data: {
                password,
                fromProfile: true
              },
              autoFocus: false
            });
          });
      }
    });
  }

  public deleteProfile() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'profile.delete-q'
      },
      autoFocus: false
    }).afterClosed().subscribe(yes => {
      if (!yes) {
        return;
      }
      this._dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'profile.delete-q2'
        },
        autoFocus: false
      }).afterClosed().subscribe(secondYes => {
        if (!secondYes) {
          return;
        }
        this._users.deleteUser({ userId: this.user.userId}).subscribe(
          () => {
            this._auth.logout();
            this._router.navigateByUrl('/login').catch(err => {
              console.error('From profile delete', err);
            });
          }
        );
      });
    });
  }

  public ngOnInit() {
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(this._userSetter);
    this.updateUser(this._route.snapshot.data['profile'], false);
    this.editMode = false;
    this.isMakingRequest = false;
    this.initializeForm();
  }

  public ngOnDestroy() {
    this.onUserRefresh$.unsubscribe();
    this._snackBar.dismiss();
  }
}

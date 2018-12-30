import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IPasswordUser,
  IUser,
  userRoleFromObject,
  userRoleNames,
  userRoleToObject,
} from '../_model/user.model';
import { ErrorStateMatcher, MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import {
  getCommonErrorMessage,
  isClientHttpError,
  ServerErrorCode,
} from '../_services/error-codes';
import { L10nService } from '../_services/l10n.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ShowPasswordDialogComponent } from '../show-password-dialog/show-password-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordPattern, passwordValidator } from '../_validators/password.validator';
import { coordsValidator, longitudeValidator } from '../_validators/coordinates.validator';
import { passwordConfirmValidator } from '../_validators/password.validator';
import { FormInvalidMatcher } from '../_validators/error-state-matchers';
import { userRoleValidator } from '../_validators/user-role.validator';

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
  protected _fb: FormBuilder;

  public generatedPassword!: boolean;
  private _passwordValidators = [Validators.required, passwordValidator];
  private _passwordConfirmationValidators = [Validators.required];

  public form!: FormGroup;
  public isMakingRequest!: boolean;
  public roleNames = userRoleNames;
  public userRoles!: Record<string, boolean>;
  public errorStateMatcher!: ErrorStateMatcher;

  get controls() {
    return this.form.controls;
  }

  constructor(
    route: ActivatedRoute,
    usersService: UsersService,
    router: Router,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10nService: L10nService,
    formBuilder: FormBuilder,
  ) {
    this._route = route;
    this._users = usersService;
    this._router = router;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10nService;
    this._fb = formBuilder;
  }

  toggleRole(roleName: string) {
    this.userRoles[roleName] = !this.userRoles[roleName];
    this.form.updateValueAndValidity();
  }

  switchPasswords() {
    this.generatedPassword = !this.generatedPassword;
    const password = (this.form.get('password') as FormControl);
    const passwordConfirmation = (this.form.get('passwordConfirmation') as FormControl);
    if (this.generatedPassword) {
      password.clearValidators();
      password.setValue('');
      passwordConfirmation.clearValidators();
      passwordConfirmation.setValue('');
    } else {
      password.setValidators(this._passwordValidators);
      password.setValidators(this._passwordConfirmationValidators);
    }
  }

  public createUser() {
    this.isMakingRequest = true;
    const newUser = this.getUserFromForm();
    console.log(newUser);
    this._users.createUser(newUser as IUser, this.generatedPassword as true).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      (user) => {
        if (this.generatedPassword) {
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
        console.error(err);
        let msg: string;
        if (isClientHttpError(err)) {
          msg = getCommonErrorMessage(err);
          if (!msg) {
            const code = err.error.code as ServerErrorCode;
            switch (code) {
              case ServerErrorCode.USER_EMAIL_DUPLICATE:
                msg = 'users.errors.email-dup';
                break;

              case 'SCHEMA_VALIDATION_FAILED' as any:
                try {
                  if (
                    err.error.results.errors[0].code === 'INVALID_FORMAT'
                    && err.error.results.errors[0].path.length === 1
                    && err.error.results.errors[0].path[0] === 'email'
                  ) {
                    msg = 'user-errors.email';
                    break;
                  }
                } catch {}

              default:
                msg = 'errors.unknown';
            }
          }
        } else {
          msg = 'errors.unknown';
        }
        console.log(msg);
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
          console.error('From user create -> navigate to users', err);
        },
      );
    });
  }

  private getUserFromForm() {
    const longitude = Number.parseFloat((this.form.get('longitude') as FormControl).value);
    const latitude = Number.parseFloat((this.form.get('latitude') as FormControl).value);
    const user = {
      email: (this.form.get('email') as FormControl).value,
      role: userRoleFromObject(this.userRoles),
      name: (this.form.get('name') as FormControl).value,
      password: (this.form.get('password') as FormControl).value,
    } as any as IPasswordUser;
    if (!Number.isNaN(longitude)) {
      user.longitude = longitude;
    }
    if (!Number.isNaN(latitude)) {
      user.latitude = latitude;
    }
    return user;
  }

  private initializeForm() {
    this.userRoles = userRoleToObject();
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],

      password: ['', this._passwordValidators],
      passwordConfirmation: ['', this._passwordConfirmationValidators],

      longitude: [null, [longitudeValidator]],
      latitude: [null, [longitudeValidator]],
    }, {
      validators: [
        passwordConfirmValidator('password', 'passwordConfirmation'),
        userRoleValidator(this.userRoles),
        coordsValidator('longitude', 'latitude')
      ],
    });
  }

  ngOnInit() {
    this.generatedPassword = false;
    this.isMakingRequest = false;
    this.initializeForm();
    this.errorStateMatcher = new FormInvalidMatcher(true);
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

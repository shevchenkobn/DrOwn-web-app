import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { passwordConfirmValidator, passwordValidator } from '../_validators/password.validator';
import {
  IPasswordUser,
  userRoleFromObject,
  userRoleNames,
  UserRoles,
  userRoleToObject,
} from '../_model/user.model';
import { coordsValidator, longitudeValidator } from '../_validators/coordinates.validator';
import { userRoleValidator } from '../_validators/user-role.validator';
import { FormInvalidMatcher } from '../_validators/error-state-matchers';

export interface IUserCreateInfo {
  user: IPasswordUser;
  generatedPassword: boolean;
}

@Component({
  selector: 'app-user-create-core',
  templateUrl: './user-create-core.component.html',
  styleUrls: ['./user-create-core.component.scss']
})
export class UserCreateCoreComponent implements OnInit, OnDestroy {
  @Output() public userSubmit!: EventEmitter<IUserCreateInfo>;
  @Input() public showProgressBar!: boolean;
  @Input() public title!: string;
  @Input() public submitButtonValue!: string;
  @Input() public showRoles?: boolean;
  @Input() public allowGeneratePassword?: boolean;

  protected _fb: FormBuilder;

  public generatedPassword!: boolean;
  private _passwordValidators = [Validators.required, passwordValidator];
  private _passwordConfirmationValidators = [Validators.required];

  public form!: FormGroup;
  public roleNames = userRoleNames;
  public userRoles!: Record<string, boolean>;
  public errorStateMatcher!: ErrorStateMatcher;

  get controls() {
    return this.form.controls;
  }

  constructor(
    formBuilder: FormBuilder,
  ) {
    this._fb = formBuilder;
    this.userSubmit = new EventEmitter<IUserCreateInfo>(true);
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

  public submitUser() {
    this.userSubmit.emit({
      user: this.getUserFromForm(),
      generatedPassword: this.generatedPassword
    });
  }

  private getUserFromForm() {
    const longitude = Number.parseFloat((this.form.get('longitude') as FormControl).value);
    const latitude = Number.parseFloat((this.form.get('latitude') as FormControl).value);
    const user = {
      email: (this.form.get('email') as FormControl).value,
      role: this.showRoles ? userRoleFromObject(this.userRoles) : UserRoles.OWNER,
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
    const formValidators = [
      passwordConfirmValidator('password', 'passwordConfirmation'),
      coordsValidator('longitude', 'latitude')
    ] as ValidatorFn[];
    if (this.showRoles) {
      this.userRoles = userRoleToObject();
      formValidators.push(userRoleValidator(this.userRoles));
    }
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],

      password: ['', this._passwordValidators],
      passwordConfirmation: ['', this._passwordConfirmationValidators],

      longitude: [null, [longitudeValidator]],
      latitude: [null, [longitudeValidator]],
    }, {
      validators: formValidators,
    });
  }

  ngOnInit() {
    this.generatedPassword = false;
    this.showProgressBar = false;
    this.errorStateMatcher = new FormInvalidMatcher(true);
    if (typeof this.allowGeneratePassword !== 'boolean') {
      this.allowGeneratePassword = true;
    }
    if (typeof this.showRoles !== 'boolean') {
      this.showRoles = true;
    }
    this.initializeForm();
  }

  ngOnDestroy() {
  }
}

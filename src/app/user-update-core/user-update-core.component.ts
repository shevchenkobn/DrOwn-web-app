import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IUser, updateRoleObjectForUser,
  userRoleFromObject,
  userRoleNames,
  UserRoles,
  userRoleToObject,
} from '../_model/user.model';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {
  coordsValidator,
  latitudeValidator,
  longitudeValidator,
} from '../_validators/coordinates.validator';
import { userRoleValidator } from '../_validators/user-role.validator';
import { FormInvalidMatcher } from '../_validators/error-state-matchers';

@Component({
  selector: 'app-user-update-core',
  templateUrl: './user-update-core.component.html',
  styleUrls: ['./user-update-core.component.scss']
})
export class UserUpdateCoreComponent implements OnInit {
  @Output() public userSubmit: EventEmitter<Partial<IUser>>;
  @Input() public submitButtonValue!: string;
  @Input() public disable!: boolean;
  @Input()
  set user(newUser: Readonly<IUser>) {
    this._user = newUser;
    this.populateFormWithUser();
  }

  protected _fb: FormBuilder;
  protected _dialog: MatDialog;

  public userRoles!: {[role: string]: boolean};
  public rolesNames = userRoleNames;
  protected _user!: Readonly<IUser>;
  public form!: FormGroup;
  public errorStateMatcher: ErrorStateMatcher;

  get controls() {
    return this.form.controls;
  }

  constructor(dialog: MatDialog, formBuilder: FormBuilder) {
    this._fb = formBuilder;
    this._dialog = dialog;

    this.userSubmit = new EventEmitter<Partial<IUser>>(true);
    this.initializeForm();
    this.errorStateMatcher = new FormInvalidMatcher(true);
  }

  isAdmin() {
    return this._user.role & UserRoles.ADMIN;
  }

  toggleRole(roleName: string) {
    this.userRoles[roleName] = !this.userRoles[roleName];
  }

  updateUser() {
    const emailControl = this.form.get('email') as FormControl;
    if (emailControl.dirty) {
      this._dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'profile.update.email-q'
        },
        autoFocus: false
      }).afterClosed().subscribe(yes => {
        if (yes) {
          this.notifyAboutUpdate();
        }
      });
    } else {
      this.notifyAboutUpdate();
    }
  }

  notifyAboutUpdate() {
    this.userSubmit.emit(this.getUserFromForm());
  }

  private getUserFromForm() {
    const updateUser = {} as Partial<IUser>;

    const emailControl = this.form.get('email') as FormControl;
    if (emailControl.dirty) {
      updateUser.email = emailControl.value;
    }
    updateUser.role = userRoleFromObject(this.userRoles);
    const nameControl = this.form.get('name') as FormControl;
    if (nameControl.dirty) {
      updateUser.name = nameControl.value;
    }
    const longitudeControl = this.form.get('longitude') as FormControl;
    if (longitudeControl.dirty) {
      updateUser.longitude = Number.parseFloat(longitudeControl.value);
    }
    const latitudeControl = this.form.get('latitude') as FormControl;
    if (latitudeControl.dirty) {
      updateUser.latitude = Number.parseFloat(latitudeControl.value);
    }
    return updateUser;
  }

  private initializeForm() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      longitude: ['', longitudeValidator],
      latitude: ['', latitudeValidator],
    }, {
      validators: [
        coordsValidator('longitude', 'latitude'),
        userRoleValidator(this.userRoles),
      ],
      updateOn: 'change'
    });
  }

  private populateFormWithUser() {
    if (!this.userRoles) {
      this.userRoles = userRoleToObject(this._user);
    } else {
      updateRoleObjectForUser(this.userRoles, this._user);
    }
    this.form.setValue({
      email: this._user.email,
      name: this._user.name,
      longitude: this._user.longitude,
      latitude: this._user.latitude
    });
  }

  ngOnInit() {
    if (!this._user) {
      throw new Error('User is not bound');
    }
    if (!this.submitButtonValue) {
      throw new Error('No submit button value');
    }
  }

}

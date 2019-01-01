import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { DronesService } from '../_services/drones.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  InvalidByFormFieldsMatcher,
  InvalidByFormFieldsMatcherFactory,
} from '../_validators/error-state-matchers';
import { deviceIdValidator } from '../_validators/device-id.validator';
import {
  coordsValidator,
  latitudeValidator,
  longitudeValidator,
} from '../_validators/coordinates.validator';
import { DroneCoordsValidatorHelper } from '../_validators/drone-coords';
import { AuthService } from '../_auth/auth.service';
import { IDroneInput } from '../_models/drone.model';
import { finalize } from 'rxjs/operators';
import { droneChangeOnErrorMessage } from '../_utils';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { IUser } from '../_models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drone-create',
  templateUrl: './drone-create.component.html',
  styleUrls: ['./drone-create.component.scss'],
})
export class DroneCreateComponent implements OnInit, OnDestroy {
  protected _fb: FormBuilder;
  protected _route: ActivatedRoute;
  protected _drones: DronesService;
  protected _router: Router;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;
  protected _auth: AuthService;

  public form!: FormGroup;
  public isMakingRequest!: boolean;
  public errorStateMatcherFactory!: InvalidByFormFieldsMatcherFactory;

  protected _owner!: Readonly<IUser>;
  private _droneCoordsValidatorHelper!: DroneCoordsValidatorHelper;
  private _refreshUser$!: Subscription;

  get controls() {
    return this.form.controls;
  }

  constructor(
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    dronesService: DronesService,
    router: Router,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10nService: L10nService,
    auth: AuthService,
  ) {
    this._fb = formBuilder;
    this._route = route;
    this._drones = dronesService;
    this._router = router;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10nService;
    this._auth = auth;

    this.initializeForm();
  }

  public createDrone() {
    this.isMakingRequest = true;
    const drone = this.getDroneFromForm();
    this._drones.createDrone(drone, false).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      () => {
        this._dialog.open(InfoDialogComponent, {
          data: {
            message: 'drones.create.done'
          }
        }).afterClosed().subscribe(() => {
          this._router.navigate(['../'], { relativeTo: this._route }).catch(
            err => {
              console.error('From drone create -> navigate to drones', err);
            },
          );
        });
      },
      err => {
        const msg = droneChangeOnErrorMessage(err);
        this._l10n.translate.get([msg, 'dialog.ok']).subscribe(translations => {
          this._snackBar.open(
            translations[msg],
            translations['dialog.ok'],
          );
        });
      },
    );
  }

  private getDroneFromForm() {
    const longitude = Number.parseFloat((
      this.form.get('baseLongitude') as FormControl
    ).value);
    const latitude = Number.parseFloat((
      this.form.get('baseLatitude') as FormControl
    ).value);
    const drone = {
      deviceId: (
        this.form.get('deviceId') as FormControl
      ).value,

      batteryPower: (
        this.form.get('batteryPower') as FormControl
      ).value,
      enginePower: (
        this.form.get('enginePower') as FormControl
      ).value,
      loadCapacity: (
        this.form.get('loadCapacity') as FormControl
      ).value,

      canCarryLiquids: (
        this.form.get('canCarryLiquids') as FormControl
      ).value,
    } as IDroneInput;
    if (!Number.isNaN(longitude)) {
      drone.baseLongitude = longitude;
    }
    if (!Number.isNaN(latitude)) {
      drone.baseLatitude = latitude;
    }
    console.log(drone);
    return drone;
  }

  private initializeForm() {
    this.form = this._fb.group({
      deviceId: ['', [Validators.required, deviceIdValidator]],

      batteryPower: ['', [Validators.required, Validators.min(0)]],
      enginePower: ['', [Validators.required, Validators.min(0)]],
      loadCapacity: ['', [Validators.required, Validators.min(0)]],

      canCarryLiquids: [false],

      baseLongitude: [null],
      baseLatitude: [null],
    }, {
      validators: [
        coordsValidator('baseLongitude', 'baseLatitude'),
      ],
      updateOn: 'change',
    });
  }

  private finishFormInitialization() {
    (this.form.get('baseLongitude') as FormControl).setValidators(
      [longitudeValidator, this._droneCoordsValidatorHelper.longitudeValidate]
    );
    (this.form.get('baseLatitude') as FormControl).setValidators(
      [latitudeValidator, this._droneCoordsValidatorHelper.latitudeValidate]
    );
  }

  ngOnInit() {
    this.isMakingRequest = false;
    this.errorStateMatcherFactory = InvalidByFormFieldsMatcher.getFactory(true);

    this._owner = this._route.snapshot.data['owner'];
    this._droneCoordsValidatorHelper =
      new DroneCoordsValidatorHelper(this._auth.onUserRefresh, this._owner);
    this.finishFormInitialization();
    this._refreshUser$ = this._auth.refreshUser().subscribe(owner => {
      this._owner = owner;
    });
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
    this._droneCoordsValidatorHelper.ngOnDestroy();
    this._refreshUser$.unsubscribe();
  }
}

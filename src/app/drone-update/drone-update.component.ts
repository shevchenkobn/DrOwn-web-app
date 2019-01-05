import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DronesService } from '../_services/drones.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { AuthService } from '../_auth/auth.service';
import {
  InvalidByFormFieldsMatcher,
  InvalidByFormFieldsMatcherFactory,
} from '../_validators/error-state-matchers';
import { IUser } from '../_models/user.model';
import { Subscription } from 'rxjs';
import {
  coordsValidator,
  latitudeValidator,
  longitudeValidator,
} from '../_validators/coordinates.validator';
import { DroneStatus, IDrone, IDroneInput } from '../_models/drone.model';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-drone-update',
  templateUrl: './drone-update.component.html',
  styleUrls: ['./drone-update.component.scss']
})
export class DroneUpdateComponent implements OnInit, OnDestroy {
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

  public droneStatus = DroneStatus;
  public drone!: Readonly<IDrone>;
  protected _owner!: Readonly<IUser>;
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

  public updateDrone() {
    this.isMakingRequest = true;
    const drone = this.getDroneFromForm();
    this._drones.updateDrone(this.drone.droneId, drone).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      })
    ).subscribe(
      updatedDrone => {
        this.saveDrone(updatedDrone);
        this._l10n.translate.get(['drones.edit.done', 'dialog.ok-good']).subscribe(
          ({'drones.edit.done': message, 'dialog.ok-good': ok}) => {
            this._snackBar.open(message, ok);
          }
        );
      },
      err => {
        console.error(err);
        this._l10n.translate.get(['errors.unknown', 'dialog.ok']).subscribe(
          ({'errors.unknown': message, 'dialog.ok': ok}) => {
            this._snackBar.open(message, ok);
          }
        );
      }
    );
  }

  public resetPassword() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'drones.edit.reset.q'
      }
    }).afterClosed().subscribe(yes => {
      if (!yes) {
        return;
      }
      this.isMakingRequest = true;
      this._drones.updateDrone(this.drone.droneId, { status: DroneStatus.UNAUTHORIZED }, true)
        .pipe(
          finalize(() => {
            this.isMakingRequest = false;
          })
        )
        .subscribe(
          drone => {
            this.saveDrone(drone);
            this._l10n.translate.get(['drones.edit.reset.done', 'dialog.ok-good']).subscribe(
              ({'drones.edit.reset.done': message, 'dialog.ok-good': ok}) => {
                this._snackBar.open(message, ok);
              }
            );
          },
          err => {
            console.error(err);
            this._l10n.translate.get(['errors.unknown', 'dialog.ok']).subscribe(
              ({'errors.unknown': message, 'dialog.ok': ok}) => {
                this._snackBar.open(message, ok);
              }
            );
          }
        );
    });
  }

  private getDroneFromForm() {
    const drone: Partial<IDroneInput> = {};

    const longitudeControl = this.form.get('baseLongitude') as FormControl;
    if (longitudeControl.dirty) {
      const longitude = Number.parseFloat(longitudeControl.value);
      if (!Number.isNaN(longitude)) {
        drone.baseLongitude = longitude;
      }
    }

    const latitudeControl = this.form.get('baseLatitude') as FormControl;
    if (latitudeControl.dirty) {
      const latitude = Number.parseFloat(latitudeControl.value);
      if (!Number.isNaN(latitude)) {
        drone.baseLatitude = latitude;
      }
    }

    const batteryPower = this.form.get('batteryPower') as FormControl;
    if (batteryPower.dirty) {
      drone.batteryPower = batteryPower.value;
    }

    const enginePower = this.form.get('enginePower') as FormControl;
    if (enginePower.dirty) {
      drone.enginePower = enginePower.value;
    }

    const loadCapacity = this.form.get('loadCapacity') as FormControl;
    if (loadCapacity.dirty) {
      drone.loadCapacity = loadCapacity.value;
    }

    const canCarryLiquids = this.form.get('canCarryLiquids') as FormControl;
    if (canCarryLiquids.dirty) {
      drone.canCarryLiquids = canCarryLiquids.value;
    }

    console.log(drone);
    return drone;
  }

  private initializeForm() {
    this.form = this._fb.group({
      batteryPower: ['', [Validators.required, Validators.min(0)]],
      enginePower: ['', [Validators.required, Validators.min(0)]],
      loadCapacity: ['', [Validators.required, Validators.min(0)]],

      canCarryLiquids: [false],

      baseLongitude: [null, [longitudeValidator]],
      baseLatitude: [null, [latitudeValidator]],
    }, {
      validators: [
        coordsValidator('baseLongitude', 'baseLatitude'),
      ],
      updateOn: 'change',
    });
  }

  private saveDrone(drone: IDrone) {
    this.drone = drone;

    const longitudeControl = this.form.get('baseLongitude') as FormControl;
    longitudeControl.setValue(drone.baseLongitude);

    const latitudeControl = this.form.get('baseLatitude') as FormControl;
    latitudeControl.setValue(drone.baseLatitude);

    const batteryPower = this.form.get('batteryPower') as FormControl;
    batteryPower.setValue(drone.batteryPower);

    const enginePower = this.form.get('enginePower') as FormControl;
    enginePower.setValue(drone.enginePower);

    const loadCapacity = this.form.get('loadCapacity') as FormControl;
    loadCapacity.setValue(drone.loadCapacity);

    const canCarryLiquids = this.form.get('canCarryLiquids') as FormControl;
    canCarryLiquids.setValue(drone.canCarryLiquids);

    this.form.markAsPristine();
  }

  ngOnInit() {
    this.isMakingRequest = false;
    this.errorStateMatcherFactory = InvalidByFormFieldsMatcher.getFactory(true);

    this._owner = this._route.snapshot.data['owner'];
    this.saveDrone(this._route.snapshot.data['drone']);
    this._refreshUser$ = this._auth.refreshUser().subscribe(owner => {
      this._owner = owner;
    });
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
    this._refreshUser$.unsubscribe();
  }
}

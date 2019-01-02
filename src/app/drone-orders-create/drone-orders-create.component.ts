import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { AuthService } from '../_auth/auth.service';
import { DroneOrdersService } from '../_services/drone-orders.service';
import {
  coordsValidator,
  latitudeValidator,
  longitudeValidator,
} from '../_validators/coordinates.validator';
import {
  DroneOrderAction,
  droneOrderActionNames,
  IDroneOrderInput,
} from '../_models/drone-order.model';
import { IDrone } from '../_models/drone.model';
import { finalize } from 'rxjs/operators';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { getCommonErrorMessage, isClientHttpError } from '../_services/error-codes';

@Component({
  selector: 'app-drone-orders-create',
  templateUrl: './drone-orders-create.component.html',
  styleUrls: ['./drone-orders-create.component.scss']
})
export class DroneOrdersCreateComponent implements OnInit, OnDestroy {
  protected _fb: FormBuilder;
  protected _route: ActivatedRoute;
  protected _droneOrders: DroneOrdersService;
  protected _router: Router;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;
  protected _auth: AuthService;

  private _drone!: Readonly<IDrone>;
  public form!: FormGroup;
  public orderAction!: DroneOrderAction;
  public isMakingRequest!: boolean;
  public actionNames = droneOrderActionNames;

  private _longitudeValidators = [Validators.required, longitudeValidator];
  private _latitudeValidators = [Validators.required, latitudeValidator];
  private _formValidators = coordsValidator('longitude', 'latitude');

  get controls() {
    return this.form.controls;
  }

  constructor(
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    droneOrders: DroneOrdersService,
    router: Router,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10nService: L10nService,
    auth: AuthService,
  ) {
    this._fb = formBuilder;
    this._route = route;
    this._droneOrders = droneOrders;
    this._router = router;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10nService;
    this._auth = auth;

    this.initializeForm();
  }

  public changeAction(newAction: DroneOrderAction) {
    this.orderAction = newAction;
    const latitude = this.form.get('latitude') as FormControl;
    const longitude = this.form.get('longitude') as FormControl;
    if (newAction === DroneOrderAction.MOVE_TO_LOCATION) {
      this.form.setValidators(this._formValidators);
      latitude.setValidators(this._latitudeValidators);
      longitude.setValidators(this._longitudeValidators);
    } else {
      this.form.clearValidators();

      latitude.clearValidators();
      latitude.setValue(null);
      latitude.markAsPristine();

      longitude.clearValidators();
      longitude.setValue(null);
      longitude.markAsPristine();
    }
  }

  public createOrder() {
    this.isMakingRequest = true;
    const order = this.getOrderFromForm();
    this._droneOrders.createDrone(order).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      () => {
        this._dialog.open(InfoDialogComponent, {
          data: {
            message: 'drone-orders.create.done'
          },
        }).afterClosed().subscribe(() => {
          this._router.navigate(['../'], { relativeTo: this._route })
            .catch(err => {
              console.error('From drone order create', err);
            });
        });
      },
      err => {
        const msg = isClientHttpError(err) && getCommonErrorMessage(err) || 'errors.unknown';
        this._l10n.translate.get([msg, 'dialog.ok']).subscribe(translations => {
          this._snackBar.open(
            translations[msg],
            translations['dialog.ok'],
          );
        });
      }
    );
  }

  private initializeForm() {
    this.orderAction = DroneOrderAction.MOVE_TO_LOCATION;
    this.form = this._fb.group({
      action: [this.orderAction, [Validators.required]],

      longitude: [null, this._longitudeValidators],
      latitude: [null, this._latitudeValidators],
    }, {
      validators: this._formValidators,
      updateOn: 'change'
    });
  }

  private getOrderFromForm() {
    const order: IDroneOrderInput = {
      deviceId: this._drone.deviceId,
      action: (this.form.get('action') as FormControl).value
    };

    const longitude = Number.parseFloat((
      this.form.get('baseLongitude') as FormControl
    ).value);
    const latitude = Number.parseFloat((
      this.form.get('baseLatitude') as FormControl
    ).value);
    if (!Number.isNaN(longitude)) {
      order.longitude = longitude;
    }
    if (!Number.isNaN(latitude)) {
      order.latitude = latitude;
    }
    console.log(order);
    return order;
  }

  ngOnInit() {
    this.isMakingRequest = false;
    this._drone = this._route.snapshot.data['drone'];
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }

}

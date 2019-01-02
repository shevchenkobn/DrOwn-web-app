import { Component, OnDestroy, OnInit } from '@angular/core';
import { DroneOrdersService } from '../_services/drone-orders.service';
import { DroneOrderAction, DroneOrderStatus, IDroneOrder } from '../_models/drone-order.model';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { getCommonErrorMessage, isClientHttpError } from '../_services/error-codes';
import { DroneStatus, IDrone } from '../_models/drone.model';

@Component({
  selector: 'app-drone-orders',
  templateUrl: './drone-orders.component.html',
  styleUrls: ['./drone-orders.component.scss'],
})
export class DroneOrdersComponent implements OnInit, OnDestroy {
  protected _route: ActivatedRoute;
  protected _droneOrders: DroneOrdersService;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public droneOrders!: IDroneOrder[];
  public drone!: IDrone;
  public isMakingRequest!: boolean;
  public columnsToDisplay = ['action', 'status', 'longitude', 'latitude'];
  public orderStatus = DroneOrderStatus;
  public orderAction = DroneOrderAction;

  constructor(
    route: ActivatedRoute,
    droneOrders: DroneOrdersService,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._route = route;
    this._droneOrders = droneOrders;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  canBeOrdered() {
    return this.drone.status !== DroneStatus.UNAUTHORIZED
      && this.drone.status !== DroneStatus.OFFLINE;
  }

  refresh() {
    this.isMakingRequest = true;
    this._droneOrders.getDroneOrders([this.drone.deviceId]).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      }),
    ).subscribe(
      orders => {
        this.droneOrders = orders;
      },
      err => {
        const msg = isClientHttpError(err) && getCommonErrorMessage(err) || 'errors.unknown';
        this._l10n.translate.get([msg, 'errors.ok']).subscribe(translations => {
          this._snackBar.open(
            translations[msg],
            translations['errors.ok']
          );
        });
      },
    );
  }

  ngOnInit() {
    this.isMakingRequest = false;
    this.drone = this._route.snapshot.data['drone'];
    this.droneOrders = [];
    this.refresh();
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DroneMeasurementsService } from '../_services/drone-measurements.service';
import { DroneRealtimeStatus, IDroneMeasurement } from '../_models/drone-measurement.model';
import { IDrone } from '../_models/drone.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize, switchMap } from 'rxjs/operators';
import { getCommonErrorMessage, isClientHttpError } from '../_services/error-codes';
import { L10nService } from '../_services/l10n.service';
import { DroneMeasurementsDeleteDialogComponent } from '../drone-measurements-delete-dialog/drone-measurements-delete-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-drone-measurements',
  templateUrl: './drone-measurements.component.html',
  styleUrls: ['./drone-measurements.component.scss'],
})
export class DroneMeasurementsComponent implements OnInit, OnDestroy {
  protected _droneMeasurements: DroneMeasurementsService;
  protected _route: ActivatedRoute;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public moment = moment;
  public columnsToDisplay = ['createdAt', 'batteryCharge', 'status', 'longitude', 'latitude'];
  public deviceState = DroneRealtimeStatus;
  public isMakingRequest!: boolean;
  public drone!: IDrone;
  public measurements!: Readonly<IDroneMeasurement[]>;

  constructor(
    droneMeasurements: DroneMeasurementsService,
    route: ActivatedRoute,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._droneMeasurements = droneMeasurements;
    this._route = route;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  public refresh() {
    this.isMakingRequest = true;
    this._droneMeasurements.getMeasurements(this.drone.deviceId).pipe(
      finalize(() => {
        this.isMakingRequest = false;
      })
    ).subscribe(
      measurements => {
        this.measurements = measurements;
      },
      err => {
        const msg = isClientHttpError(err) && getCommonErrorMessage(err) || 'errors.unknown';
        this._l10n.translate.get([msg, 'dialog.ok']).subscribe(translations => {
          this._snackBar.open(
            translations[msg],
            translations['dialog.ok']
          );
        });
      }
    );
  }

  public delete() {
    this._dialog.open(DroneMeasurementsDeleteDialogComponent, {
      autoFocus: false
    }).afterClosed().subscribe(maybeDates => {
      if (!maybeDates) {
        return;
      }
      const dates = maybeDates as [Date, Date];
      this.isMakingRequest = true;
      this._droneMeasurements.deleteMeasurements(this.drone.deviceId, dates).pipe(
        switchMap(() => {
          return this._droneMeasurements.getMeasurements(this.drone.deviceId);
        }),
        finalize(() => {
          this.isMakingRequest = false;
        })
      ).subscribe(
        (measurements) => {
          this.measurements = measurements;
          this._dialog.open(InfoDialogComponent, {
            data: {
              message: 'drone-measurements.delete.done',
              messageParams: {
                startDate: moment(dates[0]).format('lll'),
                endDate: moment(dates[1]).format('lll')
              }
            }
          });
        }
      );
    });
  }

  ngOnInit() {
    this.isMakingRequest = false;
    this.drone = this._route.snapshot.data['drone'];
    this.measurements = [];
    this.refresh();
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

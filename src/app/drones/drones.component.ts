import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';
import { DroneStatus, IDrone } from '../_models/drone.model';
import { DronesService } from '../_services/drones.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { finalize, switchMap } from 'rxjs/operators';
import {
  getCommonErrorMessage,
  isClientHttpError,
  ServerErrorCode,
} from '../_services/error-codes';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-drones',
  templateUrl: './drones.component.html',
  styleUrls: ['./drones.component.scss']
})
export class DronesComponent implements OnInit, OnDestroy {
  protected _drones: DronesService;
  protected _route: ActivatedRoute;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public isMakingRequest!: boolean;
  public drones!: IDrone[];
  public columnsToDisplay = ['deviceId', 'status', 'loadCapacity', 'details', 'delete'];
  public droneStatus = DroneStatus;

  constructor(
    drones: DronesService,
    route: ActivatedRoute,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._drones = drones;
    this._route = route;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  public refreshDrones() {
    this.isMakingRequest = true;
    this._drones.getDrones().pipe(
      finalize(() => {
        this.isMakingRequest = false;
      })
    ).subscribe(drones => {
      this.drones = drones;
    });
  }

  public deleteDrone(droneId: string) {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'drones.delete.q'
      },
      autoFocus: false
    }).afterClosed().subscribe(yes => {
      if (!yes) {
        return;
      }
      this.isMakingRequest = true;
      this._drones.deleteDrone(droneId).pipe(
        switchMap(() => {
          return this._drones.getDrones();
        }),
        finalize(() => {
          this.isMakingRequest = false;
        }),
      ).subscribe(
        (drones) => {
          this.drones = drones;
          this._l10n.translate.get(['drones.delete.done', 'dialog.ok']).subscribe(
            ({'drones.delete.done': msg, 'dialog.ok': ok}) => {
              this._snackBar.open(msg, ok);
            }
          );
        },
        (err: any) => {
          let msg: string;
          if (isClientHttpError(err)) {
            msg = getCommonErrorMessage(err);
            if (!msg) {
              const code = err.error.code as ServerErrorCode;
              if (code === ServerErrorCode.NOT_FOUND) {
                msg = 'drones.errors.not-found';
              } else {
                msg = 'errors.unknown';
              }
            }
          } else {
            msg = 'errors.network';
          }
          this._dialog.open(InfoDialogComponent, {
            data: {
              message: msg
            },
            autoFocus: false
          });
        },
      );
    });
  }

  ngOnInit() {
    this.drones = this._route.snapshot.data['drones'];
    this.isMakingRequest = false;
  }

  ngOnDestroy() {
    this._snackBar.dismiss();
  }
}

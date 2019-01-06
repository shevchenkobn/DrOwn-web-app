import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Maybe } from '../@types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-drone-measurements-delete-dialog',
  templateUrl: './drone-measurements-delete-dialog.component.html',
  styleUrls: ['./drone-measurements-delete-dialog.component.scss'],
})
export class DroneMeasurementsDeleteDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<DroneMeasurementsDeleteDialogComponent>;
  public data: Maybe<any>;

  protected _dialog: MatDialog;

  public endDate = new Date();
  public startDate = new Date(
    this.endDate.getFullYear(),
    this.endDate.getMonth(),
    this.endDate.getDate(),
  );
  public upperLimit = new Date(
    this.startDate.getTime() + 24 * 3600 * 1000
  );

  constructor(
    dialogRef: MatDialogRef<DroneMeasurementsDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Maybe<any>,
    dialog: MatDialog,
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = true;
    this.data = data;
    this._dialog = dialog;
  }

  confirm() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'drone-measurements.delete.q',
      },
    }).afterClosed().subscribe(yes => {
      if (!yes) {
        return;
      }
      this.dialogRef.close([this.startDate, this.endDate]);
    });
  }

  ngOnInit() {
  }

}

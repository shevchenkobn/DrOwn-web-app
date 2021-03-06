import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDialogData } from '../@types';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<ConfirmDialogComponent>;
  public data: IDialogData;

  constructor(
    dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: IDialogData,
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = true;
    this.data = data;
  }

  ngOnInit() {
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDialogData } from '../@types';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<InfoDialogComponent>;
  public data: IDialogData;

  constructor(
    dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: IDialogData
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = true;
    this.data = data;
  }

  ngOnInit() {
  }

}

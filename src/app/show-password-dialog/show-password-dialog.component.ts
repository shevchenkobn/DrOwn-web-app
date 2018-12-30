import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface IPasswordShowData {
  password: string;
  fromProfile: boolean;
}

@Component({
  selector: 'app-profile-show-password',
  templateUrl: './show-password-dialog.component.html',
  styleUrls: ['./show-password-dialog.component.scss']
})
export class ShowPasswordDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<ShowPasswordDialogComponent>;
  public data: IPasswordShowData;
  public prefix: string;

  constructor(
    dialogRef: MatDialogRef<ShowPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: IPasswordShowData,
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = true;
    this.data = data;
    this.prefix = data.fromProfile ? 'profile.' : '';
    console.log(this.prefix);
  }

  ngOnInit() {
  }

}

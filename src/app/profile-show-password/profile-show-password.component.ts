import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface IPasswordShowData {
  password: string;
}

@Component({
  selector: 'app-profile-show-password',
  templateUrl: './profile-show-password.component.html',
  styleUrls: ['./profile-show-password.component.scss']
})
export class ProfileShowPasswordComponent implements OnInit {
  public dialogRef: MatDialogRef<ProfileShowPasswordComponent>;
  public data: IPasswordShowData;

  constructor(
    dialogRef: MatDialogRef<ProfileShowPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data: IPasswordShowData,
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = false;
    this.data = data;
  }

  ngOnInit() {
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Maybe } from '../@types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile-password-change',
  templateUrl: './profile-password-change.component.html',
  styleUrls: ['./profile-password-change.component.scss']
})
export class ProfilePasswordChangeComponent implements OnInit {
  public dialogRef: MatDialogRef<ProfilePasswordChangeComponent>;
  public data: Maybe<any>;

  protected _dialog: MatDialog;

  public password = '';
  public passwordConfirmation = '';

  constructor(
    dialogRef: MatDialogRef<ProfilePasswordChangeComponent>,
    @Inject(MAT_DIALOG_DATA) data: Maybe<any>,
    dialog: MatDialog
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = false;
    this.data = data;
    this._dialog = dialog;
  }

  ngOnInit() {
  }

  confirm() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'profile.password.change-q'
      }
    }).afterClosed().subscribe(yes => {
      if (yes) {
        this.dialogRef.close(this.password);
      }
    });
  }

}

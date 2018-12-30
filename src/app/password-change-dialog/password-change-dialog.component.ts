import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Maybe } from '../@types';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { passwordPattern } from '../_validators/password.validator';

@Component({
  selector: 'app-profile-password-change',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss']
})
export class PasswordChangeDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<PasswordChangeDialogComponent>;
  public data: Maybe<any>;

  protected _dialog: MatDialog;

  public password = '';
  public passwordConfirmation = '';
  public pattern = passwordPattern.toString().slice(1, -1);

  constructor(
    dialogRef: MatDialogRef<PasswordChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Maybe<any>,
    dialog: MatDialog
  ) {
    this.dialogRef = dialogRef;
    this.dialogRef.disableClose = true;
    this.data = data;
    this._dialog = dialog;
  }

  ngOnInit() {
  }

  confirm() {
    this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'password.change-q'
      }
    }).afterClosed().subscribe(yes => {
      if (yes) {
        this.dialogRef.close(this.password);
      }
    });
  }

  close() {
    this.dialogRef.close('');
  }
}

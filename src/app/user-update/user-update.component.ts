import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../_services/users.service';
import { IUser } from '../_model/user.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { L10nService } from '../_services/l10n.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit {
  protected _route: ActivatedRoute;
  protected _users: UsersService;
  protected _dialog: MatDialog;
  protected _snackBar: MatSnackBar;
  protected _l10n: L10nService;

  public user!: Readonly<IUser>;
  public isMakingRequest!: boolean;

  constructor(
    route: ActivatedRoute,
    usersService: UsersService,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    l10n: L10nService,
  ) {
    this._route = route;
    this._users = usersService;
    this._dialog = dialog;
    this._snackBar = snackBar;
    this._l10n = l10n;
  }

  updateUser(user: Partial<IUser>) {
    this.isMakingRequest = true;
    this
  }

  ngOnInit() {
    this.user = this._route.snapshot.data['user'];
    this.isMakingRequest = false;
  }
}

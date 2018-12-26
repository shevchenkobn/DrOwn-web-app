import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { IUser } from '../_model/user.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected _auth: AuthService;
  protected _http: HttpClient;
  private onUserRefresh$!: Subscription;

  public user!: Readonly<IUser>;
  public editMode!: boolean;
  public formGroup?: FormGroup;

  private _userSetter = (user: Readonly<IUser> | undefined) => {
    this.user = user as IUser;
  }

  constructor(authService: AuthService, http: HttpClient) {
    this._auth = authService;
    this._http = http;
  }

  public ngOnInit() {
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(this._userSetter);
    this.updateUser();
    this.editMode = false;
  }

  public ngOnDestroy() {
    this.onUserRefresh$.unsubscribe();
  }

  private updateUser() {
    if (this._auth.hasUser()) {
      this.user = this._auth.getUser();
    } else {
      this._auth.refreshUser().subscribe(this._userSetter, err => {
        console.error('From profile updateUser ', err);
      });
    }
  }

}

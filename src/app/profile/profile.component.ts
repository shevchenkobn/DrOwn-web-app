import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { IUser } from '../_model/user.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  protected _auth: AuthService;
  protected _http: HttpClient;
  protected _fb: FormBuilder;
  protected _route: ActivatedRoute;
  private onUserRefresh$!: Subscription;

  public user!: Readonly<IUser>;
  public editMode!: boolean;
  public editUserGroup?: FormGroup;

  private _userSetter = (user: Readonly<IUser> | undefined) => {
    this.user = user as IUser;
  }

  constructor(
    authService: AuthService,
    http: HttpClient,
    formBuilder: FormBuilder,
    route: ActivatedRoute,
  ) {
    this._auth = authService;
    this._http = http;
    this._fb = formBuilder;
    this._route = route;
  }

  switchMode() {
    this.editMode = !this.editMode;
    if (this.editMode && !this.editUserGroup) {
      this.editUserGroup = this._fb.group({
        email: [''],
        role: this._fb.array([
          this._fb.control(''),
        ]),
      });
    }
  }

  public ngOnInit() {
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(this._userSetter);
    this.user = this._route.snapshot.data['profile'];
    this.editMode = false;
  }

  public ngOnDestroy() {
    this.onUserRefresh$.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { IUser } from '../_model/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  protected _route: ActivatedRoute;

  public user!: Readonly<IUser>;

  constructor(route: ActivatedRoute) {
    this._route = route;
  }

  ngOnInit() {
    this.user = this._route.snapshot.data['user'];
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { ActivatedRoute } from '@angular/router';
import { IUser, userRoleNames, userRoleToObject } from '../_model/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  protected _users: UsersService;
  protected _route: ActivatedRoute;

  public roleNames = userRoleNames;
  public userRoles!: ({[role: string]: boolean})[];
  public users!: IUser[];

  constructor(users: UsersService, route: ActivatedRoute) {
    this._users = users;
    this._route = route;
  }

  ngOnInit() {
    this.saveUsers(this._route.snapshot.data['users'] as IUser[]);
  }

  private saveUsers(users: IUser[]) {
    this.users = users;
    this.userRoles = users.map(userRoleToObject);
  }
}

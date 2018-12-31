import { Component, Input, OnInit } from '@angular/core';
import { IUser, userRoleNames, userRoleToObject } from '../_model/user.model';

@Component({
  selector: 'app-user-detail-core',
  templateUrl: './user-detail-core.component.html',
  styleUrls: ['./user-detail-core.component.scss'],
})
export class UserDetailCoreComponent implements OnInit {
  @Input()
  set user(newValue: IUser) {
    this.localUser = newValue;
    this.updateUser();
  }
  localUser!: IUser;
  roleNames = userRoleNames;
  userRoles!: Record<string, boolean>;

  constructor() {
  }

  ngOnInit() {
    if (!this.localUser) {
      throw new Error('User is not bound');
    }
  }

  private updateUser() {
    this.userRoles = userRoleToObject(this.localUser);
  }

}

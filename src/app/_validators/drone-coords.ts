import { OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../_models/user.model';
import { AbstractControl } from '@angular/forms';

export class DroneCoordsValidatorHelper implements OnDestroy {
  protected _ownerRefresh$: Subscription;
  protected _owner?: IUser;

  constructor(ownerRefresh: Observable<IUser | undefined>, user?: IUser) {
    this._ownerRefresh$ = ownerRefresh.subscribe(newUser => {
      this._owner = newUser;
    });
    this._owner = user;
  }

  longitudeValidate = (control: AbstractControl) => {
    console.log(this._owner);
    return (!!control.value || (
      this._owner && this._owner.longitude !== undefined && this._owner.longitude !== null
    ))
      ? null
      : { ownerLongitude: true };
  }

  latitudeValidate = (control: AbstractControl) =>  {
    console.log(this._owner);
    return (!!control.value || (
      this._owner && this._owner.latitude !== undefined && this._owner.latitude !== null
    ))
      ? null
      : { ownerLatitude: true };
  }

  public ngOnDestroy(): void {
    this._ownerRefresh$.unsubscribe();
  }
}

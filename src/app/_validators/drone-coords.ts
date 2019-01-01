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

  longitudeValidate = (control: AbstractControl) => (!!control.value || (
    this._owner && typeof this._owner.longitude === 'number'
  ))
    ? null
    : { ownerLongitude: true }

  latitudeValidate = (control: AbstractControl) => (!!control.value || (
    this._owner && typeof this._owner.latitude === 'number'
  ))
    ? null
    : { ownerLatitude: true }

  public ngOnDestroy(): void {
    this._ownerRefresh$.unsubscribe();
  }
}

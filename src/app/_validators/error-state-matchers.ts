import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class FormInvalidMatcher implements ErrorStateMatcher {
  private readonly _considerTouched: boolean;

  constructor(considerTouched: boolean) {
    this._considerTouched = considerTouched;
  }

  public isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return (!!control && (!this._considerTouched || control.touched) && control.invalid)
      || (!!form && (!this._considerTouched || form.touched) && form.invalid) as boolean;
  }
}

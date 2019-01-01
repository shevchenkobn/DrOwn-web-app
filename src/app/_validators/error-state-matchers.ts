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
    return (
      !!control && (
      !this._considerTouched || control.touched
      ) && control.invalid
      )
      || (
        !!form && (
        !this._considerTouched || form.touched
        ) && form.invalid
      ) as boolean;
  }
}

export type InvalidByFormFieldsMatcherFactory = (...fieldNames: string[]) => InvalidByFormFieldsMatcher;

export class InvalidByFormFieldsMatcher implements ErrorStateMatcher {
  private static _factories: Map<boolean, InvalidByFormFieldsMatcherFactory> = new Map();

  private readonly _considerTouched: boolean;
  private readonly _fieldNames: ReadonlyArray<string>;
  public static getFactory(considerTouched: boolean) {
    if (this._factories.has(considerTouched)) {
      return this._factories.get(considerTouched) as InvalidByFormFieldsMatcherFactory;
    } else {
      const factory = (...fieldNames: string[]) => (
        new InvalidByFormFieldsMatcher(fieldNames, considerTouched)
      );
      this._factories.set(considerTouched, factory);
      return factory;
    }
  }

  constructor(fieldNames: ReadonlyArray<string>, considerTouched: boolean) {
    this._considerTouched = considerTouched;
    this._fieldNames = fieldNames;
  }

  public isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return (
        !!control && (!this._considerTouched || control.touched) && control.invalid
      ) || (
        !!form && this._fieldNames.some(fieldName => {
          const controlForValidation = form.control.get(fieldName);
          if (!controlForValidation) {
            throw new Error(`Form control for name ${fieldName} is not found`);
          }
          return (
            !this._considerTouched || controlForValidation.touched
          ) && controlForValidation.invalid;
        })
      );
  }
}

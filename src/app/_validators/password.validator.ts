import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export const passwordPattern = /^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,})?$/;
export function passwordValidator(control: AbstractControl) {
  return passwordPattern.test(control.value) ? null : { passwordPattern: true };
}

export function passwordConfirmValidator(passwordField: string, passwordConfirmField: string) {
  return (formGroup: FormGroup) => (
      formGroup.get(passwordField) as FormControl
    ).value ===
    (
      formGroup.get(passwordConfirmField) as FormControl
    ).value
    ? null
    : { passwordMatch: true };
}

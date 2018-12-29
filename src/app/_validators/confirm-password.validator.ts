import { FormControl, FormGroup } from '@angular/forms';

export function passwordConfirmValidator(passwordField: string, passwordConfirmField: string) {
  return (formGroup: FormGroup) => (formGroup.get(passwordField) as FormControl).value ===
    (formGroup.get(passwordConfirmField) as FormControl).value;
}

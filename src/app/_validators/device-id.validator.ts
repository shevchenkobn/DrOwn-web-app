import { AbstractControl } from '@angular/forms';

const deviceIdRegex = /^[\da-fA-F]{12}$/;
export function deviceIdValidator(control: AbstractControl) {
  return deviceIdRegex.test(control.value) ? null : { deviceId: true };
}

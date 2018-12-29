import { AbstractControl } from '@angular/forms';

export function integerValidator(control: AbstractControl) {
  const int = Number.parseInt(control.value, 10);
  if (Number.isNaN(int)) {
    return {
      isNaN: true
    };
  }
  return null;
}

const decimalRegex = /^\d{1,7}(\.\d{0,2})?$/;
export function decimalValidator(control: AbstractControl) {
  return typeof control.value === 'string' && decimalRegex.test(control.value) ? null : {};
}

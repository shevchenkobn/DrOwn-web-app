import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

export function longitudeValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }
  const num = Number.parseFloat(control.value);
  if (Number.isNaN(num)) {
    return {
      isNaN: true
    };
  }
  if (num < -180 || num > 180) {
    return {
      longitude: true
    };
  }
  return null;
}

export function latitudeValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  }
  const num = Number.parseFloat(control.value);
  if (Number.isNaN(num)) {
    return {
      isNaN: true
    };
  }
  if (num < -90 || num > 90) {
    return {
      latitude: true
    };
  }
  return null;
}

export function coordsValidator(longitudeName: string, latitudeName: string) {
  return (formGroup: AbstractControl) => {
    const longitude = formGroup.get(longitudeName) as FormControl;
    const latitude = formGroup.get(latitudeName) as FormControl;
    return (
      (
        typeof longitude.value !== 'string'
        && typeof longitude.value !== 'number'
      )
      || (
        typeof latitude.value !== 'string'
        && typeof latitude.value !== 'number'
      )
    )
      ? { notCoords: true }
      : null;
  };
}

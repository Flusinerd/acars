import { AbstractControl } from '@angular/forms';

export function flValidator() {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value as string;
    const containsFl = value.includes('FL');
    const flightLevel = +value.split('FL')[1];
    if (flightLevel < 1) {
      return {FL: { value }};
    }
    return containsFl ? null : { FL: { value }};
  };
}
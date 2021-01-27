import { AbstractControl } from '@angular/forms';

export function icaoValidator() {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value as string;
    const fourLong = value.length === 4;
    return fourLong ? null : { icao: { value }};
  };
}
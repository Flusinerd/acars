import { AbstractControl } from '@angular/forms';

export function flightNoValidator() {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value as string;
    const containsMQT = value.includes('MQT') || value.includes('MQC');
    return containsMQT ? null : { callsign: { value }};
  };
}
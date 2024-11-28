import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rangeValidator(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value < min || value > max) {
      return { rangeError: `Must be a valid number between ${min} and ${max}` };
    }
    return null;
  };
}

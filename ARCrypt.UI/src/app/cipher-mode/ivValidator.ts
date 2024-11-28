import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { CipherMode } from './cipherMode';

export function ivValidator(cipherModeFormControl: FormControl<CipherMode>) {
  return (control: AbstractControl): ValidationErrors | null => {
    const ivValue = control.value;
    const cipherMode = cipherModeFormControl.value;

    // If cipherMode is AES-CBC, validate IV
    if (cipherMode === CipherMode.CBC) {

      if (!ivValue) {
        return null;
      }

      if (typeof ivValue !== 'string' || ivValue.length !== 16) {
        return { invalidLength: 'IV must be 16 characters long for AES-CBC mode.' };
      }
    }

    // For other cipher modes (if added in the future), no validation
    return null; // Validation passes
  };
}

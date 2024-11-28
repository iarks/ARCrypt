import { AbstractControl, FormControl } from '@angular/forms';
import { Format } from '../format/format';

export interface EncryptForm {
  plainText: AbstractControl<any, any>;
  secretKey: FormControl<string>;
  outputFormat: FormControl<Format>;
  encryptedText: AbstractControl<any, any>;
}

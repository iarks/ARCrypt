import { FormControl } from '@angular/forms';
import { Format } from '../format/format';
import { CipherMode } from '../cipher-mode/cipherMode';

export interface EncryptForm {
  plainText: FormControl<string>;
  cipherModeSelected: FormControl<CipherMode>;
  keySize: FormControl<number>;
  secretKey: FormControl<string>;
  initializationVector?: FormControl<string>;
  outputFormat: FormControl<Format>;
  encryptedText: FormControl<string>;
}

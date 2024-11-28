import { FormControl } from "@angular/forms";

export interface DecryptForm {
  cipherText: FormControl<string>;
  plainText: FormControl<string>;
  secret: FormControl<string>;
  cipherTextFormat: FormControl<string>
}

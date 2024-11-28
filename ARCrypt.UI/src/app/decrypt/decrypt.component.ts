import { Component } from '@angular/core';
import { SecretKeyComponent } from '../secret-key/secret-key.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CopyTextArea } from '../copy-text-area/copy-text-area.component';
import { FormatComponent } from '../format/format.component';
import { EncryptionService } from '../services/encryption-service.service';
import { Format } from '../format/format';
import { DecryptForm } from './decrypt-form';

@Component({
  selector: 'app-decrypt',
  imports: [
    SecretKeyComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    CopyTextArea,
    FormatComponent
  ],
  templateUrl: './decrypt.component.html',
  styleUrl: './decrypt.component.scss'
})
export class DecryptComponent {
  decryptForm!: FormGroup<DecryptForm>;

  
  constructor(private _encryptionService: EncryptionService) {
    this.decryptForm = new FormGroup<DecryptForm>({
      secret: new FormControl<string>('', Validators.required) as FormControl<string>,
      cipherText: new FormControl<string>('', Validators.required) as FormControl<string>,
      cipherTextFormat: new FormControl<Format>(Format.BASE_64) as FormControl<string>,
      plainText: new FormControl<string>('') as FormControl<string>
    });
  }

  // Encrypt button handler
  async decryptText() {

    debugger;

    if (!this.decryptForm.valid) {
      return;
    }

    try {
      let input = this.decryptForm.controls.cipherText.value;

      let secretKey = this.decryptForm.controls.secret.value;
      let formattedInput = this.convertToByteArray(input, this.decryptForm.controls.cipherTextFormat.value == Format.HEX);

      let output = await this._encryptionService.decrypt(formattedInput, secretKey, null);
      this.decryptForm.controls.plainText.setValue(this.uint8ArrayToString(output));
    } catch (error) {
      debugger;
    }
  }

  // Helper function: Format encrypted output
  base64ToBytes(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }

  convertToByteArray(data: string, isHex: boolean): Uint8Array {
    return isHex ? this.hexToBytes(data) : this.base64ToBytes(data);
  }

  uint8ArrayToString(uint8Array: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(uint8Array);
  }


}

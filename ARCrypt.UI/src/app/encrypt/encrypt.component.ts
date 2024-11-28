import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EncryptForm } from './EncryptionForm';
import { SecretKeyComponent } from '../secret-key/secret-key.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { CipherModeComponent } from '../cipher-mode/cipher-mode.component';
import { PaddingTypeComponent } from '../padding-type/padding-type.component';
import { CopyTextArea } from "../copy-text-area/copy-text-area.component";
import { KeySizeComponent } from '../key-size/key-size.component';
import { Format } from '../format/format';
import { FormatComponent } from '../format/format.component';
import { CipherMode } from '../cipher-mode/cipherMode';

@Component({
  selector: 'app-encrypt',
  imports: [
    SecretKeyComponent,
    CipherModeComponent,
    PaddingTypeComponent,
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
    KeySizeComponent,
    FormatComponent
  ],
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.scss'],
})
export class EncryptComponent implements AfterViewInit {

  encryptForm: FormGroup<EncryptForm>;

  @ViewChild(KeySizeComponent, { static: true }) keySizeComponent!: KeySizeComponent;
  @ViewChild(SecretKeyComponent, { static: true }) secretKeyComponent!: SecretKeyComponent;

  @ViewChildren(CopyTextArea) copyAreas: QueryList<CopyTextArea>;
  @ViewChild(CipherModeComponent, { static: true }) cipherModeComponent!: CipherModeComponent;
  
  constructor(public clipboard: Clipboard) {
    this.copyAreas = new QueryList();
    this.encryptForm = new FormGroup<EncryptForm>({
      plainText: new FormControl<string>('') as FormControl<string>,
      cipherModeSelected: new FormControl<CipherMode>(CipherMode.CBC) as FormControl<CipherMode>,
      keySize: new FormControl<number>(192) as FormControl<number>,
      secretKey: new FormControl<string>('') as FormControl<string>,
      initializationVector: new FormControl<string>('') as FormControl<string>,
      outputFormat: new FormControl<Format>(Format.BASE_64) as FormControl<Format>,
      encryptedText: new FormControl<string>('') as FormControl<string>,
    });
  }


  ngAfterViewInit() {
    debugger;
    const copyAreaArrays = this.copyAreas.toArray();
    let inputArea = copyAreaArrays[0] as FormControl<string>;
    let outputArea = copyAreaArrays[1] as FormControl<string>;
    inputArea.addValidators(Validators.required);
    this.encryptForm.setControl('plainText', inputArea);
    this.encryptForm.setControl('encryptedText', outputArea);
    this.secretKeyComponent.keySizeComponent = this.keySizeComponent;
  }

  onInputTextControlBind(formControl: FormControl<string>) {
    this.encryptForm.setControl('plainText', formControl);
  }

  onSecretKeyControlBind(formControl: FormControl<string>) {
    debugger;
    this.encryptForm.setControl('secretKey', formControl);
  };

  onInitVectorControlBind(formControl: FormControl<string>) {
    this.encryptForm.setControl('initializationVector', formControl);
  }

  onCipherModeControlBind(formControl: FormControl<CipherMode>) {
    this.encryptForm.setControl('cipherModeSelected', formControl);
  }

  onKeySizeControlBind(formControl: FormControl<number>) {
    this.encryptForm.setControl('keySize', formControl);
  }

  onOutputFormatBind(formControl: FormControl<Format>) {
    this.encryptForm.setControl('outputFormat', formControl);
  }


  // Encrypt button handler
  async encryptText() {
    debugger;
    let encryptedText: string;
    if (!this.encryptForm.valid) {
      return;
    }

    try {
      let secretKey = this.secretKeyComponent.saltedKey;
     
      if (!secretKey) {
        alert('looks like secret key has not been generated!');
      }
      const keyBytes = new TextEncoder().encode(secretKey)
      // Generate or parse the IV
      const ivBytes = this.cipherModeComponent.iv;

      // Generate CryptoKey from the secret key
      const modeName = this.cipherModeComponent.cipherModeControl.value;
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        {
          name: modeName,
        },
        false,
        ['encrypt']
      );

      // Encrypt the plaintext
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: modeName,
          iv: ivBytes, // Only needed for modes like CBC, GCM, etc.
        },
        cryptoKey,
        new TextEncoder().encode(this.encryptForm.get('plainText')!.value ?? '')
      );

      // Format the output (Base64 or HEX)
      encryptedText = this.formatOutput(new Uint8Array(encryptedBuffer));

      this.encryptForm.get('encryptedText')?.setValue(encryptedText);

    } catch (error) {
      console.error('Encryption error:', error);
      alert('Encryption failed. Check the inputs and try again.');
    }
  }

  // Get IV based on the cipher mode
  getIV(): Uint8Array {
    console.warn('No IV provided. Generating a random IV.');
    return crypto.getRandomValues(new Uint8Array(16)); // 16 bytes = 128 bits
  }

  // Helper function: Format encrypted output
  formatOutput(buffer: Uint8Array): string {
    const outputFormat = this.encryptForm.get('outputFormat')!.value ?? 'base64';
    if (outputFormat === Format.HEX) {
      return Array.from(buffer)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }
    if (outputFormat === Format.BASE_64) {
      return btoa(String.fromCharCode(...buffer));
    }
    return ''; // Fallback for unsupported formats
  }


}

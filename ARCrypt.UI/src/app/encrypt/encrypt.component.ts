import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { CopyTextArea } from "../copy-text-area/copy-text-area.component";
import { Format } from '../format/format';
import { FormatComponent } from '../format/format.component';
import { EncryptionService } from '../services/encryption-service.service';

@Component({
  selector: 'app-encrypt',
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
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.scss'],
})
export class EncryptComponent {

  encryptForm!: FormGroup<EncryptForm>;

  constructor(private _encryptionService: EncryptionService) {
    this.encryptForm = new FormGroup<EncryptForm>({
      plainText: new FormControl('', Validators.required) as FormControl<string>,
      encryptedText: new FormControl('') as FormControl<string>,
      secretKey: new FormControl('', Validators.required) as FormControl<string>,
      outputFormat: new FormControl(Format.BASE_64, Validators.required) as FormControl<Format>
    })

    this.encryptForm.controls.plainText.valueChanges.subscribe(x => {
      if (this.encryptForm.controls.encryptedText.value) {
        this.encryptForm.controls.encryptedText.reset();
      }
    });

    this.encryptForm.controls.secretKey.valueChanges.subscribe(x => {
      if (this.encryptForm.controls.encryptedText.value)
        this.encryptForm.controls.encryptedText.reset();

    });
  }

  // Encrypt button handler
  async encryptText() {
    if (!this.encryptForm.valid) {
      debugger;
      const x = this.encryptForm.errors;
      return;
    }

    try {
      debugger;
      let input = this.encryptForm.controls.plainText.value;
      let secretKey = this.encryptForm.controls.secretKey.value;
      let output = await this._encryptionService.encrypt(input, null, secretKey, null);
      let formattedOp = this.formatOutput(output);
      this.encryptForm.controls.encryptedText.setValue(formattedOp);
    } catch (error) {
      debugger;
    }

    
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

  reset(event: Event) {
    this.encryptForm.reset();
    this.encryptForm.controls.outputFormat.setValue(Format.BASE_64);
    for (var prop in this.encryptForm.controls) {
      this.encryptForm.get(prop)?.setErrors(null);
    }
  }

}

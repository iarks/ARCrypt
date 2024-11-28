import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl, } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { CipherMode } from './cipherMode';
import { MatTooltip } from '@angular/material/tooltip';
import { ivValidator } from './ivValidator';

@Component({
  selector: 'app-cipher-mode',
  imports: [
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonModule,
    MatTooltip
  ],
  templateUrl: './cipher-mode.component.html',
  styleUrl: './cipher-mode.component.scss'
})
export class CipherModeComponent implements OnInit {
  
  @Input() clipboard: Clipboard | null;
  @Output() onInitVectorControlBind = new EventEmitter<FormControl<string>>();
  @Output() onCipherModeControlBind = new EventEmitter<FormControl<CipherMode>>();

  CipherMode = CipherMode;

  ivControl: FormControl<string>;
  cipherModeControl: FormControl<CipherMode>;

  private textEncoder: TextEncoder;

  constructor() {
    this.textEncoder = new TextEncoder();
    this.clipboard = null;
    this.cipherModeControl = new FormControl(CipherMode.CBC) as FormControl;
    this.ivControl = new FormControl('', ivValidator(this.cipherModeControl)) as FormControl;
    this.onCipherModeControlBind = new EventEmitter<FormControl<CipherMode>>();
    this.onInitVectorControlBind = new EventEmitter<FormControl<string>>();
  }

  ngOnInit(): void {
    this.onInitVectorControlBind.emit(this.ivControl);
    this.onCipherModeControlBind.emit(this.cipherModeControl);
    this.cipherModeControl.registerOnChange((value: CipherMode) => {

    });
    this.ivControl.registerOnChange((value: string) => {

    });
  }

  copy(formControl: FormControl<string>) {
    const formControlValue = formControl.value ?? '';
    this.clipboard!.copy(formControlValue);
  }

  generateIv() {
    // Define a range of printable ASCII characters (from 32 to 126)
    const printableRange = [32, 126]; // Space to ~

    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    let result = '';

    for (let i = 0; i < 16; i++) {
      // Map each byte to a printable ASCII character in the range
      const randomChar = (randomBytes[i] % (printableRange[1] - printableRange[0] + 1)) + printableRange[0];
      result += String.fromCharCode(randomChar);
    }
    this.ivControl.setValue(result);
  }

  get iv(): Uint8Array {
    if (!this.ivControl.value) {
      return new Uint8Array();
    }

    return this.textEncoder.encode(this.ivControl.value);

  }
}

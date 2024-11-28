import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { KeySizeComponent } from '../key-size/key-size.component';
import { rangeValidator } from './range-validator';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-secret-key',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './secret-key.component.html',
  styleUrl: './secret-key.component.scss'
})
export class SecretKeyComponent implements OnInit {
  @Input() clipboard: Clipboard | null;
  @Output() onSecretKeyControlBind: EventEmitter<FormControl<string>>;

  showPassword: boolean;
  secretKeyControl: FormControl<string>;
  keySize: number;
  textEncoder: TextEncoder;
  showSalt: boolean;
  saltControl: FormControl<string>;
  iterationControl: FormControl<number>;
  private fixedLengthSaltedKey: string | null;
  generatedKey: FormControl<string>;
  constructor() {
    this.fixedLengthSaltedKey = null;
    this.showSalt = false;
    this.textEncoder = new TextEncoder();
    this.keySize = 0;
    this.showPassword = false;
    this.clipboard = null;
    this.iterationControl = new FormControl<number>(100000, rangeValidator(1, 100000)) as FormControl<number>;
    this.saltControl = new FormControl<string>('') as FormControl<string>;
    this.secretKeyControl = new FormControl<string>('', Validators.required) as FormControl<string>;
    this.generatedKey = new FormControl<string>('') as FormControl<string>;
    this.onSecretKeyControlBind = new EventEmitter<FormControl<string>>();
  }

  resetIterations() {
    this.iterationControl.setValue(100000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle visibility
  }

  toggleSaltVisibility() {
    this.showSalt = !this.showSalt; // Toggle visibility
  }

  ngOnInit() {
    this.onSecretKeyControlBind.emit(this.secretKeyControl);
    this.secretKeyControl.valueChanges.subscribe((value) => {
      this.secretChanged(value);
    });
    this.iterationControl.valueChanges.subscribe((value) => {
      this.secretChanged(this.secretKeyControl.value);
    });
    this.saltControl.valueChanges.subscribe((value) => {
      this.secretChanged(this.secretKeyControl.value);
    })
  }

  get saltedKey(): string {
    return this.fixedLengthSaltedKey ?? '';
  }


  async secretChanged(value: string) {
    const fixedLengthKey = await this.convertToFixedLengthKeyPBKDF2(value, this.keySize);

    if (!fixedLengthKey.key) {
      this.fixedLengthSaltedKey = '';
    }
    else {
      this.fixedLengthSaltedKey = btoa(String.fromCharCode(...new Uint8Array(fixedLengthKey.key as ArrayBuffer))).substring(0, 24);
    }
    this.generatedKey.setValue(this.fixedLengthSaltedKey);
  }

  copyToClipboard(formControl: FormControl<string>) {
    this.clipboard!.copy(formControl.value);
  }

  set keySizeComponent(component: KeySizeComponent) {
    if (!component) {
      return;
    }

    this.keySize = component.keySizeControl.value;

    component.keySizeControl.valueChanges.subscribe((value) => {
      this.keySize = value;
      this.secretChanged(this.secretKeyControl.value);
    })
  }

  async convertToFixedLengthKeyPBKDF2(value: string, keyLen: number): Promise<{ key: ArrayBuffer | null; salt: Uint8Array | null }> {
    if (!value) {
      return { key: null, salt: null }
    }
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      this.textEncoder.encode(value),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const salt = this.textEncoder.encode(this.saltControl.value);
    const iterations = this.iterationControl.value;

    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      keyLen
    );

    return { key: derivedKey, salt: salt };
  }
}

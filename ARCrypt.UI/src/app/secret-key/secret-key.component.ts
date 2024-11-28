import { Component, ElementRef, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { EncryptionService } from '../services/encryption-service.service';
import { Subscription } from 'rxjs';


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
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './secret-key.component.html',
  styleUrl: './secret-key.component.scss'
})
export class SecretKeyComponent implements ControlValueAccessor, OnInit {

  private _showPassword: boolean;
  protected get showPassword(): boolean{
    return this._showPassword;
  }

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };
  isDisabled = false;
  controlSubscription: Subscription | null;
  isDirectBind = true;
  private _control: FormControl<string>;
  protected get control(): FormControl<string> {
    return this._control;
  }

  @ViewChild('password') password!: ElementRef;

  constructor(private _clipboard: Clipboard, private _encryptionService: EncryptionService, @Optional() @Self() private _ngControl: NgControl) {
    debugger;
    this._control = new FormControl<string>('') as FormControl<string>;
    if (_ngControl != null) {
      _ngControl.valueAccessor = this;
    }
    this._showPassword = false;
    this.controlSubscription = this._control.valueChanges.subscribe((val) => {
      debugger;
      this.onChange(this._control.value)
    });
  }
  ngOnInit(): void {
    if (this._ngControl?.control && this._ngControl.control as FormControl<string> != null) {
      this.isDirectBind = true;
      if (this.controlSubscription != null) {
        this.controlSubscription.unsubscribe();
        this.controlSubscription = null;
        this._control = this._ngControl.control as FormControl<string>
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(obj: any): void {

    if (!this.isDirectBind) {
      const value = obj || '';
      this._control.setValue(value);
    }
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  togglePasswordVisibility() {
    this._showPassword = !this._showPassword;
  }

  copyToClipboard(event: Event) {
    event.stopPropagation();
    if (this._control.value == null || this._control.value.trim()=='') {
      return;
    }
    this._clipboard.copy(this._control.value);
  }

  paste(event: Event) {
    event.stopPropagation();
  }

  clear(event: Event) {
    event.stopPropagation();
    this._control.setValue('');
  }

  generateRandom(event: Event) {
    event.stopPropagation();
    const random = this._encryptionService.generateRandom();
    this._control.setValue(random);
  }
  
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-copytext-area',
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
    MatCardModule,
    ClipboardModule,
    MatError,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './copy-text-area.component.html',
  styleUrl: './copy-text-area.component.scss'
})
export class CopyTextArea implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() icon: string;
  @Input() readonly: boolean;
  isDirectBind = false;
  _control!: FormControl<string>;
  controlSubscription: Subscription | null;
  protected get control(): FormControl<string> {
    return this._control;
  }

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };
  isDisabled = false;

  constructor(private _clipboard: Clipboard, @Optional() @Self() public _ngControl: NgControl, private x: ControlContainer) {
    this._control = new FormControl<string>('') as FormControl<string>;
    if (_ngControl != null) {
      _ngControl.valueAccessor = this;
    }
    this.label = '';
    this.icon = '';
    this.readonly = false;
    this.controlSubscription = this._control.valueChanges.subscribe(val => {
      this.onChange(this._control.value);
    })
  }

  ngOnInit() {

    if (this._ngControl?.control && (this._ngControl?.control as FormControl<string>) != null) {
      this.isDirectBind = true;

      if (this.controlSubscription != null) {
        this.controlSubscription.unsubscribe();
        this.controlSubscription = null;
      }

      // replace the current control directly with the control set in the parent. This will allow for be
      this._control = this._ngControl.control as FormControl<string>;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  writeValue(obj: any): void {
    // if this is direct bind, this is not required
    if (!this.isDirectBind) {
      const val = obj || '';
      this._control.setValue(val);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  copy(event: Event): void {
    event.stopPropagation()
    if (this._control.value == null || this._control.value.trim() == '') {
      return;
    }

    this._clipboard?.copy(this._control.value);
  }

  paste(event: Event) {
    event.stopPropagation();
    navigator.clipboard.readText().then(text => {
      this._control.setValue(text);
    });
  }

  clear(event: Event) {
    event.stopPropagation();
    this._control.setValue('');
  }
}

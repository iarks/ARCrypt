import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, Form, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Format } from './format';

@Component({
  selector: 'app-format',
  imports: [MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  standalone: true
})
export class FormatComponent implements ControlValueAccessor {
  Format = Format;
  @Input() label!: string;
  isDisabled: boolean;
  @ViewChild(MatButtonToggleGroup) buttonGroup!: ElementRef;

  formControl: FormControl<Format>;

  onChange = (value: Format) => { };
  onTouch = () => { }

  constructor(@Optional() @Self() public ngControl: NgControl) {

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.formControl = new FormControl<Format>(Format.BASE_64) as FormControl<Format>;
    this.isDisabled = false;
    this.label = "Ciphertext Format:";
  }

  writeValue(obj: any): void {
    const value = obj || Format.BASE_64;
    this.formControl.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange() {
    debugger;
    const value = this.formControl.value;
    this.onChange(this.formControl.value);
  }
}

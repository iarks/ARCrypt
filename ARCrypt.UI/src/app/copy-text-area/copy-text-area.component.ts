import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

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
    CommonModule
  ],
  templateUrl: './copy-text-area.component.html',
  styleUrl: './copy-text-area.component.scss'
})
export class CopyTextArea extends FormControl<string|null> {
  @Input() clipboard: Clipboard|null;
  @Input() label: string;
  @Input() icon: string;
  control: FormControl<string>;
  constructor() {
    super('')
    this.label = '';
    this.icon = '';
    this.clipboard = null;
    this.control = this as FormControl<string>;
  }

  copy(): void {
    const secret = this.value??'';
    this.clipboard?.copy(secret);
  }

  getallErrors(): string | null {
    debugger;
    if (!this.errors) {
      return null;
    }

    let errorList = new Array<string>;

    Object.keys(this.errors).forEach(errorKey => {
        errorList.push(errorKey)
    });

    return errorList.join(',');
  }
}

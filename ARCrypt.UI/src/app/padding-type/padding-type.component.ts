import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-padding-type',
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
  ],
  templateUrl: './padding-type.component.html',
  styleUrl: './padding-type.component.scss'
})
export class PaddingTypeComponent {
  @Output() padding = new EventEmitter<FormControl<string>>();

  paddingType: FormControl<string>;

  constructor() {
    this.paddingType = new FormControl('PKCS7') as FormControl;
    this.padding = new EventEmitter<FormControl<string>>();
  }

  ngOnInit(): void{
    this.padding.emit(this.paddingType);
  }
}

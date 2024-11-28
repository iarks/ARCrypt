import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-key-size',
  imports: [
    MatButtonToggleModule,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './key-size.component.html',
  styleUrl: './key-size.component.scss',
  standalone: true
})
export class KeySizeComponent implements OnInit {

  @Output() controlEmitter: EventEmitter<FormControl<number>>;
  keySizeControl: FormControl<number>;

  constructor() {
    this.controlEmitter = new EventEmitter<FormControl>();
    this.keySizeControl = new FormControl<number>(192) as FormControl<number>;
  }

  ngOnInit(): void {
    this.controlEmitter.emit(this.keySizeControl);
  }

}

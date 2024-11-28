import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { Format } from './format';

@Component({
  selector: 'app-format',
  imports: [MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule],
  templateUrl: './format.component.html',
  styleUrl: './format.component.scss',
  standalone: true
})
export class FormatComponent implements OnInit {
  @Output() onFormControlBind: EventEmitter<FormControl<Format>>;
  control: FormControl<Format>;
  Format = Format;

  constructor() {
    this.control = new FormControl<Format>(Format.BASE_64) as FormControl<Format>;
    this.onFormControlBind = new EventEmitter<FormControl<Format>>();
  }

  ngOnInit(): void {
    this.onFormControlBind.emit(this.control);
  }
}

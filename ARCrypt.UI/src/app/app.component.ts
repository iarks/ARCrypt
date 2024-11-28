import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncryptComponent } from "./encrypt/encrypt.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EncryptComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'arcrypt';
}

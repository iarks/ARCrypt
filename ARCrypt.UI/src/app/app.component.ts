import { Component } from '@angular/core';
import { EncryptComponent } from "./encrypt/encrypt.component";
import { DecryptComponent } from './decrypt/decrypt.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-root',
  imports: [
    EncryptComponent, DecryptComponent, MatTabsModule, CommonModule, MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatChipsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'arcrypt';
  version = '0.0.1';

  showFiller = false;

}

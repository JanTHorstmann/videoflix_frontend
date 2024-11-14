import { Component } from '@angular/core';
import { NavbarComponent } from '../../dashboard/navbar/navbar.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [
    NavbarComponent,
  ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  navbarButton: string = 'display: none;'
}

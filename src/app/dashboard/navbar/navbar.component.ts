import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() showButton: string = ''

  navigateToLogin() {
    window.location.href = '/login';
  }
}

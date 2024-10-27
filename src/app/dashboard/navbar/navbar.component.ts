import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() showLogInButton: string = '';
  @Input() showLogOutButton: string = '';

  navigateToLogin() {
    window.location.href = '/login';
  }

  logOut() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    this.navigateToLogin();
  }
}

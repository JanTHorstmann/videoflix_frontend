import { Component, Input } from '@angular/core';

/**
 * NavbarComponent is a standalone component that handles navigation and authentication buttons.
 * It provides two buttons for logging in and logging out. 
 * The component reacts to changes in the `showLogInButton` and `showLogOutButton` inputs to display 
 * the appropriate buttons on the navbar.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  /**
   * A string input to control the visibility of the login button.
   * If the value is truthy, the login button will be displayed.
   */
  @Input() showLogInButton: string = '';

  /**
   * A string input to control the visibility of the logout button.
   * If the value is truthy, the logout button will be displayed.
   */
  @Input() showLogOutButton: string = '';

  /**
   * Navigates the user to the login page by changing the window location to the login URL.
   */
  navigateToLogin() {
    window.location.href = '/login';
  }

    /**
   * Logs out the user by removing the authentication token from localStorage and sessionStorage,
   * then redirects to the login page.
   */
  logOut() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    this.navigateToLogin();
  }
}

import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { GuidelinesComponent } from '../../../guidelines/guidelines.component';

/**
 * Component for handling user login.
 * 
 * This component provides a login form where users can input their email and password.
 * It supports "Remember Me" functionality and toggling password visibility.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    GuidelinesComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
   * Indicates whether the "Remember Me" option is selected.
   */
  rememberMe: boolean = false;

  /**
   * Flag to indicate if the user entered incorrect login credentials.
   */
  wrongEntry: boolean = false;

  /**
   * Style for the login button in the navbar.
   */
  navbarButton: string = 'display: none;';

  /**
   * The user's email input for login.
   */
  email: string = '';

  /**
   * The user's password input for login.
   */
  password: string = '';

  /**
   * Controls the visibility of the password input field.
   */
  passwordType: string = 'password';

  /**
   * Source of the icon used for toggling password visibility.
   */
  passwordSrc: string = 'assets/img/eye.png';

    /**
   * @param http - Service for sending HTTP requests.
   * @param authService - Service for handling authentication-related operations.
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.rememberLogIn();
  }

    /**
   * Checks if the user is already logged in by looking for tokens in localStorage or sessionStorage.
   * 
   * - If a token is found, it sends a request to the server to validate it.
   * - Redirects the user to the dashboard if the token is valid.
   */
  rememberLogIn() {
    const auth_token = localStorage.getItem('auth_token');
    const session_token = sessionStorage.getItem('auth_token');    
    if (auth_token || session_token) {
      let headers : HttpHeaders;
      if (auth_token) {
        headers = new HttpHeaders().set('Authorization', `Token ${auth_token}`);
      } else {
        headers = new HttpHeaders().set('Authorization', `Token ${session_token}`);
      }      
      this.http.post(`${environment.loginURL}`, {}, { headers }).subscribe({
        next: (response: any) => {
          window.location.href = '/dashboard';
        },
        error: (error) => {
          console.error('Fehler beim Login:', error);
        }
      });
    }
  }

    /**
   * Handles the login process when the form is submitted.
   * 
   * - Prevents the default form submission behavior.
   * - Sends a POST request with the user's email and password.
   * - Stores the token in localStorage or sessionStorage based on the "Remember Me" option.
   * - Redirects to the dashboard on successful login.
   * 
   * @param event - The event triggered by form submission.
   */
  login(event: Event) {
    event.preventDefault();
    const logInData = {
      email: this.email,
      password: this.password,
    };    
    this.http.post(`${environment.loginURL}`, logInData).subscribe({
      next: (response: any) => {
        if (response.token) {
          if (this.rememberMe) {
            this.authService.login(response.token);
          } else {
            sessionStorage.setItem('auth_token', response.token);
          }
          window.location.href = '/dashboard';
        } else {
          console.error('Kein Token in der Antwort enthalten.');
        }
      },
      error: (error) => {
        this.wrongEntry = true;
      }
    });
  }

    /**
   * Toggles the visibility of the password input field.
   * 
   * - Changes the input type between 'password' and 'text'.
   * - Updates the icon for the visibility toggle button.
   */
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

    /**
   * Toggles the "Remember Me" option.
   */
  saveLogInToken() {
    this.rememberMe = !this.rememberMe;     
  }
}

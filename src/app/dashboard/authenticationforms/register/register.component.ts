import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { CommonModule } from '@angular/common';
import { VideoplayService } from '../../../services/videoplay.service';
import { GuidelinesComponent } from '../../../guidelines/guidelines.component';

/**
 * Component for handling user registration.
 * 
 * This component allows users to sign up by providing their email, username (generated from the email), 
 * and password. It also includes client-side validation for matching passwords.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NotificationBannerComponent,
    GuidelinesComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

   /** User-provided username, derived from their email. */
   username: string = '';

   /** User-provided email address. */
   email: string = '';
 
   /** User-provided password. */
   password: string = '';
 
   /** Confirmation of the user's password. */
   passwordConfirm: string = '';
 
   /** Flag to indicate if there is an error with password confirmation. */
   showError: boolean = false;
 
   /** Flag to indicate if there is an error with the provided email. */
   emailError: boolean = false;
 
   /** Inline style for hiding the navbar button. */
   navbarButton: string = 'display: none;';
 
   /** Type attribute for the password input field to toggle visibility. */
   passwordType: string = 'password';
 
   /** Type attribute for the confirm password input field to toggle visibility. */
   passwordTypeConfirm: string = 'password';
 
   /** Image source for the password visibility toggle button. */
   passwordSrc: string = 'assets/img/eye.png';
 
   /** Image source for the confirm password visibility toggle button. */
   passwordConfirmSrc: string = 'assets/img/eye.png';
 
   /**
    * @param http - HTTP client for sending registration data to the backend.
    * @param videoservice - Service for managing video playback state and notification banners.
    */
  constructor(
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) { }

   /**
   * Handles the sign-up process.
   * 
   * Validates the provided passwords, generates a username from the email, and sends
   * the registration data to the backend.
   * 
   * @param event - The form submit event.
   */
  signUp(event: Event) {
    event.preventDefault();
    if (this.password !== this.passwordConfirm) {
      this.showError = true;
      return;
    }
    this.username = this.email.split('@')[0];
    const signUpData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };
    this.sendRegistrationData(signUpData);    
  }

   /**
   * Sends the user registration data to the backend.
   * 
   * @param signUpData - Object containing user registration information.
   */
  sendRegistrationData(signUpData: {}) {
    this.http.post(`${environment.registerURL}`, signUpData).subscribe({
      next: (response) => {
        this.videoservice.showBanner = true;
        setTimeout(() => {
          this.videoservice.moveBanner = true;
        }, 10);
        setTimeout(() => {
          this.videoservice.showBanner = false;
          this.videoservice.moveBanner = false;
          window.location.href = '/login';
        }, 2000);
      },
      error: (error) => {
        console.error('Fehler bei der Registrierung', error);
        this.emailError = true;
      }
    });
  }

    /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

    /**
   * Toggles the visibility of the confirm password input field.
   */
  toggleConfrimPasswordVisibility() {
    this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';
    this.passwordConfirmSrc = this.passwordConfirmSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }
}

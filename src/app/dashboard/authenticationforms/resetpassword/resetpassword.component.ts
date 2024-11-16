import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { VideoplayService } from '../../../services/videoplay.service';
import { CommonModule } from '@angular/common';
import { GuidelinesComponent } from '../../../guidelines/guidelines.component';

/**
 * Component for handling the password reset process.
 * 
 * This component allows users to reset their password using a token obtained from a reset email.
 * It provides client-side validation to ensure the password and its confirmation match.
 */
@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NotificationBannerComponent,
    GuidelinesComponent,
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
  /** Token obtained from the query parameters of the reset link. */
  token!: string;

  /** Flag to indicate if there is an error with password confirmation. */
  showError: boolean = false;

  /** User-provided new password. */
  password: string = '';

  /** Confirmation of the new password. */
  passwordConfirm: string = '';

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
   * @param activatedRoute - Service for accessing the current route and its query parameters.
   * @param http - HTTP client for sending password reset data to the backend.
   * @param videoservice - Service for managing video playback state and notification banners.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) { }

   /**
   * Initializes the component by extracting the token from the query parameters.
   */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });    
  }

   /**
   * Handles the form submission for resetting the password.
   * 
   * Validates the provided passwords and sends the reset request to the backend.
   * 
   * @param event - The form submit event.
   */
  sendResetMail(event: Event) {
    event.preventDefault();
    if (this.password !== this.passwordConfirm) {
      this.showError = true;
      return;
    }
    const resetURL = `${environment.resetPasswordURL}?token=${this.token}`;
    const resetData = {
      new_password: this.password,
    };
    this.sendResetData(resetURL, resetData)
  }

   /**
   * Sends the password reset data to the backend.
   * 
   * @param resetURL - The endpoint for resetting the password.
   * @param resetData - The payload containing the new password.
   */
  sendResetData(resetURL: string, resetData: {}) {
    this.http.post(resetURL, resetData).subscribe({
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

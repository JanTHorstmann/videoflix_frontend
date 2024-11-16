import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { VideoplayService } from '../../../services/videoplay.service';
import { GuidelinesComponent } from '../../../guidelines/guidelines.component';

/**
 * Component for handling password reset requests.
 * 
 * This component allows users to request a password reset by entering their email address.
 * It sends a reset email and displays notifications for success or failure.
 */
@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    NavbarComponent,
    NotificationBannerComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    GuidelinesComponent,
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {
  /**
   * Indicates whether the "Remember Me" option is selected.
   */
  rememberMe: boolean = false;

  /**
   * Flag to indicate if an incorrect email entry occurred.
   */
  wrongEntry: boolean = false;

  /**
   * Style for the login button in the navbar.
   */
  navbarButton: string = 'display: none;';

  /**
   * The user's email address input for the password reset request.
   */
  email: string = '';

  /**
   * Placeholder for password, not used directly in this component.
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
   * @param videoservice - Service for handling video-related operations and notifications.
   */
  constructor(
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) { }

    /**
   * Sends a password reset email.
   * 
   * - Prevents the default form submission behavior.
   * - Sends a POST request to the backend with the provided email.
   * - Displays a notification banner on success and redirects to the login page.
   * - Sets the `wrongEntry` flag to true on failure.
   * 
   * @param event - The event triggered by form submission.
   */
  sendResetMail(event: Event) {
    event.preventDefault();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload = { email: this.email };

    this.http.post(`${environment.forgotPasswordURL}`, payload, { headers })
      .subscribe({
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
          console.error('Error sending password reset email:', error);
          this.wrongEntry = true;
        }
      });
  }

}

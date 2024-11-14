import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { CommonModule } from '@angular/common';
import { VideoplayService } from '../../../services/videoplay.service';
import { GuidelinesComponent } from '../../../guidelines/guidelines.component';

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

  username: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  showError: boolean = false;
  emailError: boolean = false
  navbarButton: string = 'display: none;'

  constructor(
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) { }

  signUp(event: Event) {
    event.preventDefault();
    if (this.password !== this.passwordConfirm) {
      this.showError = true;
      return;
    }

    this.username = this.email.split('@')[0]

    const signUpData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

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

  passwordType: string = 'password';
  passwordTypeConfirm: string = 'password'
  passwordSrc: string = 'assets/img/eye.png';
  passwordConfirmSrc: string = 'assets/img/eye.png';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

  toggleConfrimPasswordVisibility() {
    this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';
    this.passwordConfirmSrc = this.passwordConfirmSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }
}

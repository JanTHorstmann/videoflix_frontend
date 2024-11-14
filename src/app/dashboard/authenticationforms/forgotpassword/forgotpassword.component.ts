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
  rememberMe: boolean = false;
  wrongEntry: boolean = false;
  navbarButton: string = 'display: none;'
  email: string = '';
  password: string = '';

  passwordType: string = 'password';
  passwordSrc: string = 'assets/img/eye.png';

  constructor(
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) {  }

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

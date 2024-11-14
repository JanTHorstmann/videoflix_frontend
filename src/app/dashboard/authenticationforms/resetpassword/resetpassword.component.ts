import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { VideoplayService } from '../../../services/videoplay.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NotificationBannerComponent,
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
  token!: string;

  showError: boolean = false;
  password: string = '';
  passwordConfirm: string = '';
  navbarButton: string = 'display: none;'

  passwordType: string = 'password';
  passwordTypeConfirm: string = 'password'
  passwordSrc: string = 'assets/img/eye.png';
  passwordConfirmSrc: string = 'assets/img/eye.png';

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public videoservice: VideoplayService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });    
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

  toggleConfrimPasswordVisibility() {
    this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';
    this.passwordConfirmSrc = this.passwordConfirmSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

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
}

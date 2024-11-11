import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
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
    private authService: AuthService,
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
          console.log('Password reset email sent:', response);
          this.wrongEntry = false;
          alert('An email has been sent with password reset instructions.');
        },
        error: (error) => {
          console.error('Error sending password reset email:', error);
          this.wrongEntry = true;
        }
      });
  }

}

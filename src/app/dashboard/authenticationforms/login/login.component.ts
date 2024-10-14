import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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
  ) {
    this.rememberLogIn();
  }

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
          console.log('Erfolgreich eingeloggt!', response);
          window.location.href = '/dashboard';
        },
        error: (error) => {
          console.error('Fehler beim Login:', error);
        }
      });
    }
  }

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

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

  saveLogInToken() {
    this.rememberMe = !this.rememberMe;     
  }
}

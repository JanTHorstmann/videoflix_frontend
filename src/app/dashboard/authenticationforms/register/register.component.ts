import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    HttpClientModule,
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
  navbarButton: string = 'display: none;'

  constructor(private http: HttpClient) { }

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

    console.log('Data:', signUpData);

    this.http.post(`${environment.registerURL}`, signUpData).subscribe({
      next: (response) => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Fehler bei der Registrierung', error);
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

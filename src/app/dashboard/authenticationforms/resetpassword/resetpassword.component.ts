import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
  showError: boolean = false;
  password: string = '';
  passwordConfirm: string = '';
  navbarButton: string = 'display: none;'

  passwordType: string = 'password';
  passwordTypeConfirm: string = 'password'
  passwordSrc: string = 'assets/img/eye.png';
  passwordConfirmSrc: string = 'assets/img/eye.png';

  constructor(private http: HttpClient) { }

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

    const resetData = {
      password: this.password,
    };

    console.log('Data:', resetData);

    this.http.post(`${environment.resetPasswordURL}`, resetData).subscribe({
      next: (response) => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Fehler bei der Registrierung', error);
      }
    });
  }
}

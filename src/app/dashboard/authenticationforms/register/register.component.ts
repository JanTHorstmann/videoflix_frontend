import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  username:string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  showError: boolean = false;

  constructor(private http: HttpClient) {}

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
    
    this.http.post('http://127.0.0.1:8000/register/', signUpData).subscribe({
      next: (response) => {
        // console.log('Erfolgreich registriert!', response);
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Fehler bei der Registrierung', error);
        // Hier kannst du Fehlerbehandlung durchführen, z.B. Fehlermeldungen anzeigen
      }
    });
  }

  passwordType: string = 'password';
  passwordTypeConfirm: string = 'password'
  passwordSrc: string = 'assets/img/eye.png';
  passwordConfirmSrc: string = 'assets/img/eye.png';

  togglePasswordVisibility() {
    // Umschalten zwischen Passwort-Anzeige und normaler Textanzeige
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';

    // Icon ändern je nach Sichtbarkeit des Passworts
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }

  toggleConfrimPasswordVisibility() {
    // Umschalten zwischen Passwort-Anzeige und normaler Textanzeige
    this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';

    // Icon ändern je nach Sichtbarkeit des Passworts
    this.passwordConfirmSrc = this.passwordConfirmSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }
}

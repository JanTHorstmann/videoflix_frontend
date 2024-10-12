import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  login() {
    console.log('Log in!!')
  }

  passwordType: string = 'password';
  passwordSrc: string = 'assets/img/eye.png';

  togglePasswordVisibility() {
    // Umschalten zwischen Passwort-Anzeige und normaler Textanzeige
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';

    // Icon ändern je nach Sichtbarkeit des Passworts
    this.passwordSrc = this.passwordSrc === 'assets/img/eye-off.png' ? 'assets/img/eye.png' : 'assets/img/eye-off.png';
  }
}

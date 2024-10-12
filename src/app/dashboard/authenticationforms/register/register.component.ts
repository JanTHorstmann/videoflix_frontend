import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  signUp() {
    console.log('Log in!!')
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

import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  login() {
    console.log('Log in!!')
  }
}
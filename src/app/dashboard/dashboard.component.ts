import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    HttpClientModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  token: string = '';
  videos: {} = {};

  constructor(
    private http: HttpClient,
  ) {
    const auth_token = localStorage.getItem('auth_token');
    const session_token = sessionStorage.getItem('auth_token');

    if (auth_token) {
      this.token = auth_token;
    }
    if (session_token) {
      this.token = session_token;
    }
    console.log('token', this.token);
    this.loadVideoContent();
  }


  loadVideoContent() {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.token}`);

    this.http.get(`${environment.videoContentURL}`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Content', response);
        this.videos = response;
      },
      error: (error) => {
        console.error('Fehler beim Content', error);
      }
    });
  }

}

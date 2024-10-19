import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PreviewvideoComponent } from './videocontent/previewvideo/previewvideo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    PreviewvideoComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  token: string = '';
  videos: {} = {};
  loadContent: boolean = false
  previewVideo:{ title?: string, description?: string, created_at?: string, video_file?: string } = {};

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
        this.previewVideo = response[0]
        this.loadContent = true;
      },
      error: (error) => {
        console.error('Fehler beim Content', error);
      }
    });
  }

}

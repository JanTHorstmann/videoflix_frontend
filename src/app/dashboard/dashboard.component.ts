import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PreviewvideoComponent } from './videocontent/previewvideo/previewvideo.component';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './videocontent/video/video.component';
import { VideoslideshowComponent } from './videocontent/videoslideshow/videoslideshow.component';
import { VideoplayService } from '../services/videoplay.service';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    PreviewvideoComponent,
    VideoComponent,
    VideoslideshowComponent,
    VideoplayerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  
  token: string = '';
  videos: any[] = [];
  // previewVideo: { title?: string, description?: string, created_at?: string, video_file?: string, thumbnail?: string } = {};
  groupedVideos: { [category: string]: any[] } = {};

  constructor(
    private http: HttpClient,
    public videoService: VideoplayService,
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
        this.videoService.previewVideo = response[0];
        this.groupVideosByCategory();
        this.videoService.loadContent = true;
      },
      error: (error) => {
        console.error('Fehler beim Content', error);
      }
    });
  }

  groupVideosByCategory() {
    this.videos.forEach((video) => {
      const category = video.category || 'Uncategorized';
      if (!this.groupedVideos[category]) {
        this.groupedVideos[category] = [];
      }
      this.groupedVideos[category].push(video);
    });
    for (const category in this.groupedVideos) {
      this.groupedVideos[category].sort((a, b) => a.title.localeCompare(b.title));
    }
    console.log('Gruppierte Videos:', this.groupedVideos);
  }

  getCategories(): string[] {
    return Object.keys(this.groupedVideos);
  }

  

}

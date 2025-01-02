import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PreviewvideoComponent } from './videocontent/previewvideo/previewvideo.component';
import { CommonModule } from '@angular/common';
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
    VideoslideshowComponent,
    VideoplayerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  token: string = '';
  videos: any[] = [];

  continueWatchingVideos: any[] = [];
  continueWatching: boolean = false;
  navbarButton: string = 'display: none;';
  groupedVideos: { [category: string]: any[] } = {};

  constructor(
    private http: HttpClient,
    public videoService: VideoplayService,
  ) {
    const auth_token = localStorage.getItem('auth_token');
    const session_token = sessionStorage.getItem('auth_token');
    if (auth_token) {
      this.videoService.auth_token = auth_token;
    }
    if (session_token) {
      this.videoService.auth_token = session_token;
    }
    this.loadVideoContent();
    this.loadWatchedVideos();
  }

  loadWatchedVideos() {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.videoService.auth_token}`);
    this.http.get(`${environment.videoProgessURL}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.length > 0) {
          this.findWatchedVideos(response);
          this.continueWatching = true
        }        
      },
      error: (error) => {
        console.error('Fehler beim Content', error);
      }
    });
  }

  findWatchedVideos(watchedVideos: any) {
    this.continueWatchingVideos = [];
    this.videos.forEach((video) => {
      watchedVideos.forEach((watched: any) => {
        if (video.id === watched.video_id) {  // Überprüfe, ob die IDs übereinstimmen 
          let watchedVideo = {
            id: video.id,
            title: video.title,
            description: video.description,
            video_file: video.video_file,
            thumbnail: video.thumbnail,
            created_at: video.created_at,
            played_time: watched.played_time,
            duration: watched.duration,
            watched: true,
          }         
          this.continueWatchingVideos.push(watchedVideo);  // Füge das Video zu continueWatchingVideos hinzu          
        }
      })
    })
  }

  loadVideoContent() {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.videoService.auth_token}`);
    this.http.get(`${environment.videoContentURL}`, { headers }).subscribe({
      next: (response: any) => {
        this.videos = response;
        this.sortByDate();
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
    this.groupedVideos = {};
    this.videos.forEach((video) => {
      video.watched = false;
      
      const category = video.category || 'Uncategorized';
      if (!this.groupedVideos[category]) {
        this.groupedVideos[category] = [];
      }
      this.groupedVideos[category].push(video);
    });
    for (const category in this.groupedVideos) {
      this.groupedVideos[category].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA.getTime() - dateB.getTime();
      });
    }
  }

  sortByDate() {
    this.videos.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  }

  getCategories(): string[] {
    return Object.keys(this.groupedVideos);
  }

  backToVideoSelection() {
    this.loadVideoContent();
    this.loadWatchedVideos();
    this.videoService.returnToVideoSelection();
  }
}

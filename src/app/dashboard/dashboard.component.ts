import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { PreviewvideoComponent } from './videocontent/previewvideo/previewvideo.component';
import { CommonModule } from '@angular/common';
import { VideoslideshowComponent } from './videocontent/videoslideshow/videoslideshow.component';
import { VideoplayService } from '../services/videoplay.service';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';

/**
 * DashboardComponent is responsible for loading and displaying video content.
 * It fetches video data from an API, groups the videos by category, and 
 * provides the necessary data to other components such as Navbar, VideoSlideshow, 
 * and VideoPlayer. It also manages the token for authentication and controls 
 * the visibility of buttons in the navbar.
 */
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

  /**
   * Stores the authentication token used for API requests.
   */
  token: string = '';

  /**
   * An array of videos fetched from the server to be displayed on the dashboard.
   */
  videos: any[] = [];

  /**
   * A string representing the visibility of the navbar button. The default is hidden.
   */
  navbarButton: string = 'display: none;';

  /**
   * An object that groups videos by their categories.
   */
  groupedVideos: { [category: string]: any[] } = {};

  /**
   * Creates an instance of the DashboardComponent.
   * Initializes the token from localStorage or sessionStorage and fetches the video content.
   * @param http The HttpClient used to make HTTP requests.
   * @param videoService The service responsible for managing video content and playback.
   */
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
    this.loadVideoContent();
  }

  /**
   * Fetches video content from the server using an authenticated API request.
   * Upon success, the videos are saved, and the videos are grouped by category.
   */
  loadVideoContent() {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.token}`);
    this.http.get(`${environment.videoContentURL}`, { headers }).subscribe({
      next: (response: any) => {
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

    /**
   * Groups the videos by category and sorts them alphabetically by title.
   * Categories are dynamically created if they do not exist.
   */
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
  }

    /**
   * Returns an array of category names from the grouped videos.
   * @returns An array of category names.
   */
  getCategories(): string[] {
    return Object.keys(this.groupedVideos);
  }
}

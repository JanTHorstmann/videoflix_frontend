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

  continueWatchingVideos: any[] = [];
  continueWatching: boolean = false;

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
    this.loadWatchedVideos();
  }

  loadWatchedVideos() {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.token}`);
    this.http.get(`${environment.videoProgessURL}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.length == 0) {
          console.log('continueWatchingVideos is empty');

        } else {
          this.findWatchedVideos(response);
          console.log('continueWatchingVideos', this.continueWatchingVideos);
          console.log('Videos', this.videos);
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
    console.log(this.videos);
    console.log(this.continueWatchingVideos);    
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

    /**
   * Groups the videos by category and sorts them alphabetically by title.
   * Categories are dynamically created if they do not exist.
   */
  groupVideosByCategory() {
    this.videos.forEach((video) => {
      video.watched = false;
      console.log('Video:', video);
      
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

/**
 * Sorts the videos array by the `created_at` property in ascending order.
 * 
 * Each video object is expected to have a `created_at` property in the format `YYYY-MM-DD`.
 * The method converts these strings into JavaScript Date objects for comparison.
 * 
 * - Older videos (earlier dates) will appear first in the array.
 * - If you want the newest videos first, reverse the subtraction in the `sort` callback.
 * 
 * @throws {Error} If `created_at` is not a valid date format for any video object.
 */
  sortByDate() {
    this.videos.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  }

    /**
   * Returns an array of category names from the grouped videos.
   * @returns An array of category names.
   */
  getCategories(): string[] {
    return Object.keys(this.groupedVideos);
  }
}

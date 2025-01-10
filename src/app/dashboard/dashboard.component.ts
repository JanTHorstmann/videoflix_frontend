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
 * DashboardComponent is responsible for managing the dashboard view, 
 * which includes displaying videos, grouping them by category, 
 * and handling the "Continue Watching" functionality.
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

  /** Token for user authentication */
  token: string = '';

  /** List of all videos fetched from the server */
  videos: any[] = [];

  /** List of videos the user has partially watched */
  continueWatchingVideos: any[] = [];

  /** Flag to determine if the "Continue Watching" section should be displayed */
  continueWatching: boolean = false;

  /** Inline CSS for the navbar button */
  navbarButton: string = 'display: none;';

  /** Object grouping videos by their categories */
  groupedVideos: { [category: string]: any[] } = {};

  /**
   * Represents the height of the content container as a string, 
   * This can be dynamically updated based on the content or window size.
   */
  contentHeight: string = '';

  /**
   * Constructor to initialize dependencies and load video content.
   * @param http - Angular's HttpClient for making HTTP requests
   * @param videoService - Service for managing video playback and state
   */
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
    
    this.contentHeight = `-${window.innerHeight * 0.25}px`

    this.loadVideoContent();
    this.loadWatchedVideos();
  }

  /**
   * Loads the list of watched videos from the server and updates the "Continue Watching" section.
   */
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

  /**
   * Matches watched videos with the full list of videos and updates the "Continue Watching" list.
   * @param watchedVideos - List of videos with progress data
   */
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

  /**
   * Loads the full video content from the server.
   */
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

  /**
   * Groups videos by their categories and sorts them within each category by creation date.
   */
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

  /**
   * Sorts the video list by their creation date.
   */
  sortByDate() {
    this.videos.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Retrieves the list of video categories.
   * @returns Array of category names
   */
  getCategories(): string[] {
    return Object.keys(this.groupedVideos);
  }

  /**
   * Reloads the video content and watched videos, returning the user to the main video selection view.
   */
  backToVideoSelection() {
    this.loadVideoContent();
    this.loadWatchedVideos();
    this.videoService.returnToVideoSelection();
  }

  /**
   * Adjusts the vertical position of the content container based on the scroll position.
   * When scrolling, the container moves upward but does not exceed 50% of the screen height.
   *
   * @param {Event} event - The scroll event triggered by the user interaction.
   */
  scaleContentContainer(event: Event) {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const scrollTop = target.scrollTop;
      const halfWindowsHeight = window.innerHeight * 0.5;

      if (scrollTop == 0) {
        this.contentHeight = `-${halfWindowsHeight / 2}px`;
      } else {
        this.contentHeight = `-${halfWindowsHeight}px`;;
      }
    }
  }
}

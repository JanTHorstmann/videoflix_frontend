import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';
import { IMediaElement, VgCoreModule, VgApiService, BitrateOptions } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import * as dashjs from 'dashjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

/**
 * @description This component is responsible for rendering and managing the video player.
 * It supports functionalities like video quality switching, playback tracking, and progress saving.
 * The component uses Videogular's API for video playback control and interacts with a backend service
 * to update or delete video progress data.
 * 
 * @class VideoplayerComponent
 */
@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  /** Reference to the video player element */
  @ViewChild('videoPlayer', { static: false }) videoPlayer: any;

  /** Timer for video progress tracking */
  videoProgressInterval: any;

  /** DASH.js player instance for adaptive bitrate streaming */
  dashPlayer!: any;

  /** Instance of Videogular's API service */
  api!: VgApiService;

  /** Container for managing subscriptions */
  subscriptions: Subscription = new Subscription();

  /** Available DASH video bitrate options */
  dashBitrates: BitrateOptions[] = [
    { qualityIndex: 0, height: 1080, width: 1920, bitrate: 3000000, label: '1080p', mediaType: 'video' },
    { qualityIndex: 1, height: 720, width: 1280, bitrate: 1500000, label: '720p', mediaType: 'video' },
    { qualityIndex: 2, height: 360, width: 640, bitrate: 800000, label: '360p', mediaType: 'video' },
    { qualityIndex: 3, height: 120, width: 160, bitrate: 200000, label: '120p', mediaType: 'video' },
  ];

  /** Video duration in seconds */
  videoDuration!: number;

  /** Current playback time in seconds */
  videoCurrentTime!: number;

  /** URLs for different video quality levels */
  videoSrc_120p = '';
  videoSrc_360p = '';
  videoSrc_720p = '';
  videoSrc_1080p = '';

  /** Flag to determine if the user is asked to continue watching */
  askForContinue: boolean;

  /**
   * @constructor
   * @param {VideoplayService} videoService - Service to manage video playback data.
   * @param {HttpClient} http - Angular's HTTP client for API interactions.
   */
  constructor(
    public videoService: VideoplayService,
    private http: HttpClient,
  ) {
    this.getVideoQuality();
    this.askForContinue = this.videoService.videoContent.watched ?? false;

  }

  /**
   * Initializes the Dash.js player after the view has been fully initialized.
   * 
   * - Checks if the `videoPlayer` is a valid HTMLMediaElement.
   * - Dynamically imports the Dash.js library if running in a browser environment.
   * - Creates a Dash.js player instance and initializes it with the media element and video file.
   * - Logs an error if Dash.js fails to load or if the code is running on the server.
   */
  ngAfterViewInit() {
    if (this.videoPlayer.nativeElement && this.videoPlayer.nativeElement instanceof HTMLMediaElement) {
      if (typeof window !== 'undefined') {
        import('dashjs').then(dashjs => {
          this.dashPlayer = dashjs.MediaPlayer().create();
          this.dashPlayer.initialize(this.videoPlayer.nativeElement, this.videoService.videoContent.video_file, true);
        }).catch(err => console.error('Failed to load Dash.js:', err));
      } else {
        console.log('Dash.js is not initialized because the code is running on the server.');
      }
    }
  }

  /**
   * Initializes the video player with Videogular's API.
   * Sets up subscriptions for player events like `loadedData`, `timeUpdate`, and `ended`.
   * @param {VgApiService} api - The API instance for controlling the video player.
   */
  onPlayerReady(api: VgApiService) {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.videoService.auth_token}`);
    this.api = api;
    this.loadDataSub();
    this.timeUpdateSub(headers);
    this.endedVideoSub(headers);
    if (!this.videoService.videoContent.watched) {
      this.api.getDefaultMedia().play();
    }
  }

  /**
   * Subscribes to the `loadedData` event and sets the video start time if applicable
   */
  loadDataSub() {
    const loadStartSub = this.api.getDefaultMedia().subscriptions.loadedData.subscribe(() => {
      if (this.videoService.videoStartTime >= 0 && this.videoService.videoContent.watched) {
        const mediaElement = this.videoPlayer.nativeElement;
        mediaElement.currentTime = this.videoService.videoStartTime;        
      }
    });
    this.subscriptions.add(loadStartSub);
  }

  /**
   * Subscribes to the `timeUpdate` event and updates video progress on the server.
   * @param {HttpHeaders} headers - HTTP headers containing the authentication token.
   */
  timeUpdateSub(headers: HttpHeaders) {
    const timeUpdateSub = this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
      const progressData = {
        video_id: this.videoService.videoContent.id,
        played_time: this.videoPlayer.nativeElement.currentTime,
        duration: this.videoPlayer.nativeElement.duration,
      };
      if (progressData.video_id && progressData.played_time && progressData.duration) {
        this.updateVideoProgess(progressData, headers);
      }
    });
    this.subscriptions.add(timeUpdateSub);
  }

  /**
   * Subscribes to the `ended` event and deletes video progress on the server.
   * @param {HttpHeaders} headers - HTTP headers containing the authentication token.
   */
  endedVideoSub(headers: HttpHeaders) {
    const endedSub = this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      this.deleteVideoProgess(headers);
    });
    this.subscriptions.add(endedSub);
  }

  /**
   * Resumes video playback from a specified time or restarts playback.
   * @param {number} time - The time in seconds to start playback from.
   */
  continueOrStartAgain(time: number) {
    this.askForContinue = false;
    this.videoPlayer.nativeElement.currentTime = time;
    this.api.currentTime = time;
    this.api.getDefaultMedia().play();
  }

  /**
   * Deletes video progress data from the server.
   * @param {HttpHeaders} headers - HTTP headers containing the authentication token.
   */
  deleteVideoProgess(headers: HttpHeaders) {
    this.http.delete(`${environment.videoProgessURL}${this.videoService.videoContent.id}/delete_progress/`, { headers }).subscribe({
      next: () => {
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      },
      error: (err) => {
        console.error('Error deleting progress:', err);
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      },
    });
  }

  /**
   * Updates video progress data on the server.
   * @param {any} progressData - The progress data object containing `video_id`, `played_time`, and `duration`.
   * @param {HttpHeaders} headers - HTTP headers containing the authentication token.
   */
  updateVideoProgess(progressData: any, headers: HttpHeaders) {
    this.http.post(`${environment.videoProgessURL}`, progressData, { headers }).subscribe({
      next: (response: any) => {
        // console.log('Progress updated:', response);
      },
      error: (error) => {
        console.error('Error updating progress:', error);
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      }
    });
  }

  /**
   * Generates URLs for different video quality levels based on the video file name.
   */
  getVideoQuality() {
    if (this.videoService.videoContent.video_file) {
      let src = this.videoService.videoContent.video_file.split('.mp4');
      this.videoSrc_120p = src[0] + '_120p.mp4';
      this.videoSrc_360p = src[0] + '_360p.mp4';
      this.videoSrc_720p = src[0] + '_720p.mp4';
      this.videoSrc_1080p = src[0] + '_1080p.mp4';
    }
  }

  /**
   * Changes the video bitrate and updates the video source.
   * @param {any} bitrate - The selected bitrate option.
   */
  setBitrate(bitrate: any) {
    if (this.dashPlayer) {
      this.dashPlayer.setQualityFor('video', bitrate.qualityIndex);
      if (bitrate.label === '1080p') {
        this.updateVideoSource(this.videoSrc_1080p);
      } else if (bitrate.label === '720p') {
        this.updateVideoSource(this.videoSrc_720p);
      } else if (bitrate.label === '360p') {
        this.updateVideoSource(this.videoSrc_360p);
      } else if (bitrate.label === '120p') {
        this.updateVideoSource(this.videoSrc_120p);
      }
    } else {
      console.error('DASH player instance is not initialized!');
    }
  }

  /**
   * Updates the video player with a new source and maintains playback position.
   * @param {string} newSource - The new video source URL.
   */
  updateVideoSource(newSource: string) {
    if (this.videoPlayer && this.videoPlayer.nativeElement instanceof HTMLMediaElement) {
      const mediaElement = this.videoPlayer.nativeElement;
      const currentTime = mediaElement.currentTime;
      mediaElement.src = newSource;
      mediaElement.load();
      mediaElement.onloadeddata = () => {
        mediaElement.currentTime = currentTime;
        mediaElement.play().catch((err: any) => {
          console.error('Error resuming playback:', err);
        });
      };
    } else {
      console.error('Video player element is not a valid HTMLMediaElement!');
    }
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy() {
    if (this.videoProgressInterval) {
      clearInterval(this.videoProgressInterval);
    }
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}

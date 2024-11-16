import { Injectable } from '@angular/core';

/**
 * VideoplayService is responsible for managing the state of video playback and interface visibility.
 * It controls whether the video interface should be shown, whether video content is loaded, and manages video-related data.
 */
@Injectable({
  providedIn: 'root'
})
export class VideoplayService {

  /**
   * A boolean indicating whether the video interface should be shown.
   * Defaults to `false`.
   */
  showInterface: boolean = false;

  /**
   * A boolean indicating whether the video is being played.
   * Defaults to `false`.
   */
  playVideo: boolean = false;

  /**
   * A boolean indicating whether the video content is being loaded.
   * Defaults to `false`.
   */
  loadContent: boolean = false;

  /**
   * A boolean indicating whether the banner should be moved.
   * Defaults to `false`.
   */
  moveBanner: boolean = false;

  /**
   * A boolean indicating whether the banner should be shown.
   * Defaults to `false`.
   */
  showBanner: boolean = false;

  /**
   * An object containing information about the currently loaded video content.
   * Includes title, description, video file, thumbnail, and creation date.
   */
  videoContent: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string } = {};

  /**
   * An object containing information about the currently previewed video.
   * Includes title, description, video file, thumbnail, and creation date.
   */
  previewVideo: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string } = {};

  /**
   * A variable to store a timeout reference for controlling interface visibility.
   */
  timeout: any;

  /**
   * Creates an instance of VideoplayService.
   */
  constructor() { }

  /**
   * Resets the video state and returns to the video selection screen.
   * Hides the video and reloads the content.
   */
  returnToVideoSelection() {
    this.playVideo = false;
    this.loadContent = true;
  }

  /**
   * Shows the video interface and sets a timeout to hide it after 1 second of inactivity.
   */
  getInterface() {
    this.showInterface = true;  
    
    // Clear any existing timeout and set a new one
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.showInterface = false;
    }, 1000);
  }
}

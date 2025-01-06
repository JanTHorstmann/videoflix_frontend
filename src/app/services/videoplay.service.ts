import { Injectable } from '@angular/core';

/**
 * Service to manage video playback, state, and user interface interactions for videos.
 */
@Injectable({
  providedIn: 'root'
})
export class VideoplayService {

  /** 
     * Authentication token used for secured requests. 
     */
  auth_token: string = '';

  /** 
   * Flag to indicate if the video interface should be displayed. 
   */
  showInterface: boolean = false;

  /** 
   * Flag to indicate if a video is currently being played. 
   */
  playVideo: boolean = false;

  /** 
   * Flag to indicate if the video content has been fully loaded. 
   */
  loadContent: boolean = false;

  /** 
   * Flag to control the movement of banners during UI interactions. 
   */
  moveBanner: boolean = false;

  /** 
   * Flag to indicate if the banner is currently visible. 
   */
  showBanner: boolean = false;

  /** 
   * Timestamp of when the video started playing. 
   */
  videoStartTime!: number;

  /** 
   * Current video content being viewed or interacted with.
   * Includes optional fields for video metadata like id, title, description, etc.
   */
  videoContent: { 
    id?: number, 
    title?: string, 
    description?: string, 
    video_file?: string, 
    thumbnail?: string, 
    created_at?: string, 
    watched?: boolean 
  } = {};

  /** 
   * Video content for the "Continue Watching" feature. 
   * Includes optional fields for video metadata like id, title, description, etc.
   */
  videoContentContinue: { 
    id?: number, 
    title?: string, 
    description?: string, 
    video_file?: string, 
    thumbnail?: string, 
    created_at?: string, 
    watched?: boolean 
  } = {};

  /** 
   * Preview video metadata to be displayed in the UI.
   * Includes optional fields like title, description, video_file, etc.
   */
  previewVideo: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string } = {};

  /** 
   * Timeout identifier for managing interface visibility. 
   */
  timeout: any;

  /**
   * Constructor for the VideoplayService.
   */
  constructor() { }

  /**
   * Resets the state to return the user to the main video selection view.
   */
  returnToVideoSelection() {
    this.playVideo = false;
    this.loadContent = true;
  }

  /**
   * Displays the video interface temporarily, hiding it after a specified timeout.
   */
  getInterface() {
    this.showInterface = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.showInterface = false;
    }, 1000);
  }
}

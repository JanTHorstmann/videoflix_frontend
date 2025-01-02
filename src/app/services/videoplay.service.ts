import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoplayService {

  auth_token: string = '';

  showInterface: boolean = false;

  playVideo: boolean = false;

  loadContent: boolean = false;

  moveBanner: boolean = false;

  showBanner: boolean = false;

  videoStartTime!: number;

  videoContent: { id?: number, title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string, watched?: boolean } = {};

  videoContentContinue: { id?: number, title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string, watched?: boolean } = {};

  previewVideo: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string } = {};

  timeout: any;

  constructor() { }

  returnToVideoSelection() {
    this.playVideo = false;
    this.loadContent = true;
  }
  getInterface() {
    this.showInterface = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.showInterface = false;
    }, 1000);
  }
}

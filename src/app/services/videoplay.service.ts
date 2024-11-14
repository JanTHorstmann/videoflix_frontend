import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoplayService {

  showInterface: boolean = false;
  playVideo: boolean = false;
  loadContent: boolean = false;
  moveBanner: boolean = false;
  showBanner: boolean = false;
  videoContent: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string, } = {}
  previewVideo: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string, } = {}
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

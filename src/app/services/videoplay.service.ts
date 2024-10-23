import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoplayService {

  playVideo: boolean = false;
  loadContent: boolean = false;
  videoContent: { title?: string, description?: string, src?: string, thumbnail?: string, created_at?: string, } = {}

  constructor() { }

  returnToVideoSelection() {
    this.playVideo = false;
    this.loadContent = true;
  }
}

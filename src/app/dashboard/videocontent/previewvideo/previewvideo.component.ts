import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-previewvideo',
  standalone: true,
  imports: [],
  templateUrl: './previewvideo.component.html',
  styleUrl: './previewvideo.component.scss'
})
export class PreviewvideoComponent {
  @ViewChild('previewVideoPlayer') previewVideoPlayer!: ElementRef;

  @Input() previewVideo: {
    title: string,
    description: string,
    src: string,
    created_at: string,    
  }

  constructor() {
    this.previewVideo = {
      title: '',
      description: '',
      src: '',
      created_at: '',
    }
  }

  playInRange(video: HTMLVideoElement) {
    const startTime = 0;
    const endTime = 10;

    video.currentTime = startTime;

    video.ontimeupdate = () => {
      if (video.currentTime >= endTime) {
        video.pause();
      }
    };

    video.play();
    
  }


}

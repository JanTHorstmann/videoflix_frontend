import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-previewvideo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './previewvideo.component.html',
  styleUrl: './previewvideo.component.scss'
})
export class PreviewvideoComponent {
  @ViewChild('previewVideoPlayer') previewVideoPlayer!: ElementRef;

  previousPreviewVideoSrc: string | undefined;

  constructor(
    public videoService: VideoplayService
  ) { }

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

  ngDoCheck() {
    if (this.videoService.previewVideo.video_file !== this.previousPreviewVideoSrc) {
      this.previousPreviewVideoSrc = this.videoService.previewVideo.video_file;
      this.reloadVideo();
    }
  }

  reloadVideo() {
    const videoElement = this.previewVideoPlayer.nativeElement;
    videoElement.load();
    videoElement.play();
  }

}

import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';
import { CommonModule } from '@angular/common';

/**
 * PreviewvideoComponent displays a video preview and manages video playback behavior.
 * The component checks for changes in the video source and reloads the video if necessary.
 * It also provides functionality to play the video within a specific time range.
 */
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
  /**
   * A reference to the video element used for the video preview.
   */
  @ViewChild('previewVideoPlayer') previewVideoPlayer!: ElementRef;

  /**
   * Stores the previous video source to detect changes in the video file.
   */
  previousPreviewVideoSrc: string | undefined;

  /**
   * Creates an instance of the PreviewvideoComponent.
   * @param videoService The service responsible for controlling video playback and preview.
   */
  constructor(
    public videoService: VideoplayService
  ) { }

  /**
   * Plays the video in a specific time range from 0 to 10 seconds.
   * The video will pause automatically when it reaches 10 seconds.
   * 
   * @param video The HTMLVideoElement to be played.
   */
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

    /**
   * Lifecycle hook that checks if the video source has changed.
   * If it has, the video is reloaded and played again.
   */
  ngDoCheck() {
    if (this.videoService.previewVideo.video_file !== this.previousPreviewVideoSrc) {
      this.previousPreviewVideoSrc = this.videoService.previewVideo.video_file;
      this.reloadVideo();
    }
  }

    /**
   * Reloads the video by reloading the video element and starting playback.
   */
  reloadVideo() {
    if (this.previewVideoPlayer) {
      const videoElement = this.previewVideoPlayer.nativeElement;
      videoElement.load();
      videoElement.play();
    }
  }
}

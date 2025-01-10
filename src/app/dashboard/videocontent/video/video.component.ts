import { Component, Input } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';
import { CommonModule } from '@angular/common';

/**
 * VideoComponent handles displaying a video with its details (title, description, thumbnail) 
 * and provides functionality to play the video or change the preview video.
 */
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  /**
 * Input property that defines the video details, including the title, description, video file,
 * thumbnail image, and creation date.
 */
  @Input() video: {
    id: string,
    title: string,
    description: string,
    video_file: string,
    thumbnail: string,
    created_at: string,
    played_time: number,
    duration: number,
    watched: boolean,
  }

  barWith: string = '';

  /**
 * Creates an instance of VideoComponent.
 * Initializes the video input property with default values.
 * @param videoService The service responsible for controlling video playback and preview.
 */
  constructor(
    private videoService: VideoplayService,
  ) {
    this.video = {
      id: '',
      title: '',
      description: '',
      video_file: '',
      thumbnail: '',
      created_at: '',
      played_time: 0,
      duration: 0,
      watched: false,
    }
  }

  timeOutChange: any;

  ngOnInit() {
    this.calculateProgressBar();
  }

  calculateProgressBar() {
    if (this.video.watched) {
      let progress = (this.video.played_time * 100) / this.video.duration;
      this.barWith = `${progress}%`;
    }
  }

  /**
 * Starts playing the selected video. This method updates the video service to 
 * indicate that the video content should be played and loads the selected video.
 * 
 * @param videoElement The video element that is being played.
 */
  playVideo(videoElement: any) {
    if (this.video.watched) {
      this.videoService.videoStartTime = this.video.played_time;
    }
    
    this.videoService.loadContent = false;
    this.videoService.playVideo = true;
    this.videoService.videoContent = videoElement.video;
  }

  /**
 * Changes the preview video. Updates the video service to set the new video for preview.
 * 
 * @param videoElement The video element that should be used as the new preview video.
 */
  changePreviewVideo(videoElement: any) {
    this.timeOutChange = setTimeout(() => {
      
      this.videoService.previewVideo = videoElement.video
    }, 1000);
  }

  clearTimeOut() {
    if (this.timeOutChange) {
      clearTimeout(this.timeOutChange);
      this.timeOutChange = null; // Optional: Setze die Timeout-ID auf null, um anzuzeigen, dass der Timeout gelöscht wurde.
    }
  }
}

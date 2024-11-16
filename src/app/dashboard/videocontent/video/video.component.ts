import { Component, Input } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';

/**
 * VideoComponent handles displaying a video with its details (title, description, thumbnail) 
 * and provides functionality to play the video or change the preview video.
 */
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

    /**
   * Input property that defines the video details, including the title, description, video file,
   * thumbnail image, and creation date.
   */
  @Input() video: {
    title: string,
    description: string,
    video_file: string,
    thumbnail: string,
    created_at: string,    
  }

    /**
   * Creates an instance of VideoComponent.
   * Initializes the video input property with default values.
   * @param videoService The service responsible for controlling video playback and preview.
   */
  constructor(
    private videoService: VideoplayService,
  ) {
    this.video = {
      title: '',
      description: '',
      video_file: '',
      thumbnail: '',
      created_at: '',
    }
  }

    /**
   * Starts playing the selected video. This method updates the video service to 
   * indicate that the video content should be played and loads the selected video.
   * 
   * @param videoElement The video element that is being played.
   */
  playVideo(videoElement: any) {
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
    this.videoService.previewVideo = videoElement.video
  }
}

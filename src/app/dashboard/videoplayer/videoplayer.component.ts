import { Component } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';

/**
 * VideoplayerComponent handles the video playback functionality, 
 * allowing users to play videos in different resolutions (480p, 720p, 1080p).
 * It uses the VideoplayService to retrieve and manage video content.
 */
@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  /**
   * The source URL for the video at 480p resolution.
   * This will be set based on the video file's path.
   */
  videoSrc_480p = '';

  /**
   * The source URL for the video at 720p resolution.
   * This will be set based on the video file's path.
   */
  videoSrc_720p = '';

  /**
   * The source URL for the video at 1080p resolution.
   * This will be set based on the video file's path.
   */
  videoSrc_1080p = '';

  /**
   * Creates an instance of VideoplayerComponent.
   * Calls the `getVideoQuality` method to determine the available video resolutions.
   * @param videoService The service responsible for managing video content and playback.
   */
  constructor(
    public videoService: VideoplayService,
  ) {
    this.getVideoQuality();
  }

    /**
   * Determines the available video resolutions (480p, 720p, 1080p) 
   * by extracting the base video file name and appending the respective resolution suffix.
   */
  getVideoQuality() {
    if (this.videoService.videoContent.video_file) {
      let src = this.videoService.videoContent.video_file.split('.mp4');
      this.videoSrc_480p = src[0] + '_480p.mp4';
      this.videoSrc_720p = src[0] + '_720p.mp4';
      this.videoSrc_1080p = src[0] + '_1080p.mp4';      
    }
  }
}

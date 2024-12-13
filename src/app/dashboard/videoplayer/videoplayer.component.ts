import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  videoDuration!: number;
  videoCurrentTime!: number;

  /**
   * The source URL for the video at 480p resolution.
   * This will be set based on the video file's path.
   */
  videoSrc_120p = '';

  /**
 * The source URL for the video at 480p resolution.
 * This will be set based on the video file's path.
 */
  videoSrc_360p = '';

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

  ngOnInit() {
    let currentTimeInterval = setInterval(() => {
      if (this.videoPlayer.nativeElement) {
        this.videoDuration = this.videoPlayer.nativeElement.duration
        
        if (this.videoCurrentTime == this.videoDuration) {
          clearInterval(currentTimeInterval);
        }
        this.videoCurrentTime = this.videoPlayer.nativeElement.currentTime
        console.log('CurrentTime:', this.videoCurrentTime);
        console.log('TotalTime:', this.videoDuration);
      }
    }, 2000);
  }

  /**
 * Determines the available video resolutions (480p, 720p, 1080p) 
 * by extracting the base video file name and appending the respective resolution suffix.
 */
  getVideoQuality() {
    if (this.videoService.videoContent.video_file) {
      let src = this.videoService.videoContent.video_file.split('.mp4');
      this.videoSrc_120p = src[0] + '_120p.mp4';
      this.videoSrc_360p = src[0] + '_436p.mp4';
      this.videoSrc_720p = src[0] + '_720p.mp4';
      this.videoSrc_1080p = src[0] + '_1080p.mp4';
    }
  }
}

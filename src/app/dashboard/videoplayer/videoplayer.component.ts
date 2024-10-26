import { Component } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';
import { log } from 'node:console';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  videoSrc_480p = '';
  videoSrc_720p = '';
  videoSrc_1080p = '';

  constructor(
    public videoService: VideoplayService,
  ) {
    this.getVideoQuality();
  }

  getVideoQuality() {
    if (this.videoService.videoContent.video_file) {
      let src = this.videoService.videoContent.video_file.split('.mp4')
      console.log('src:', src);
      this.videoSrc_480p = src[0] + '_480p.mp4';
      this.videoSrc_720p = src[0] + '_720p.mp4';
      this.videoSrc_1080p = src[0] + '_1080p.mp4';
      console.log(this.videoSrc_480p);
      console.log(this.videoSrc_720p)
      console.log(this.videoSrc_1080p);
      
    }

  }


}

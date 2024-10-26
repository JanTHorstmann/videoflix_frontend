import { Component, Input } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  @Input() video: {
    title: string,
    description: string,
    video_file: string,
    thumbnail: string,
    created_at: string,    
  }

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

  playVideo(videoElement: any) {
    console.log(videoElement.video);
    this.videoService.loadContent = false;
    this.videoService.playVideo = true;
    this.videoService.videoContent = videoElement.video;
  }

  changePreviewVideo(videoElement: any) {
    console.log(videoElement.video);     
    this.videoService.previewVideo = videoElement.video
  }
}

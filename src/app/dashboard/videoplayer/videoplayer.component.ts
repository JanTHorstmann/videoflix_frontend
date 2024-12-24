import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';
import { IMediaElement, VgCoreModule, VgApiService, BitrateOptions } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import * as dashjs from 'dashjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<IMediaElement>;
  videoProgressInterval: any;
  dashPlayer!: any;
  api: VgApiService = new VgApiService;

  dashBitrates: BitrateOptions[] = [
    { qualityIndex: 0, height: 1080, width: 1920, bitrate: 3000000, label: '1080p', mediaType: 'video' },
    { qualityIndex: 1, height: 720, width: 1280, bitrate: 1500000, label: '720p', mediaType: 'video' },
    { qualityIndex: 2, height: 360, width: 640, bitrate: 800000, label: '360p', mediaType: 'video' },
    { qualityIndex: 3, height: 120, width: 160, bitrate: 200000, label: '120p', mediaType: 'video' },
  ];

  videoDuration!: number;
  videoCurrentTime!: number;

  videoSrc_120p = '';

  videoSrc_360p = '';

  videoSrc_720p = '';

  videoSrc_1080p = '';


  onPlayerReady(source: VgApiService) {
    this.api = source;
    console.log('onPlayerReady');
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.autoplay.bind(this)
    )
  }

  autoplay() {
    console.log('play');
    this.api.play();
  }

  constructor(
    public videoService: VideoplayService,
    private http: HttpClient,
  ) {
    this.getVideoQuality();
  }

  ngOnInit() {

    if (this.videoPlayer.nativeElement && this.videoPlayer.nativeElement instanceof HTMLMediaElement) {

      if (typeof window !== 'undefined') {
        import('dashjs').then(dashjs => {
          this.dashPlayer = dashjs.MediaPlayer().create();
          this.dashPlayer.initialize(this.videoPlayer.nativeElement, this.videoService.videoContent.video_file, true);
        }).catch(err => console.error('Failed to load Dash.js:', err));
      } else {
        console.log('Dash.js is not initialized because the code is running on the server.');
      }
      this.trackVideoProgress();      
    }
  }

  trackVideoProgress() {
    // Upload video progress every 2 seconds
    this.videoProgressInterval = setInterval(() => {
      const videoElement = this.videoPlayer.nativeElement;

      if (!videoElement.paused && videoElement.currentTime) {
        const progressData = {
          video_id: this.videoService.videoContent.id, // Assuming the videoContent has an `id`
          played_time: videoElement.currentTime,
        };
        console.log(this.videoService.videoContent.id);
        

        // this.http.post('/api/video-progress/update_progress/', progressData).subscribe(
        //   (response) => console.log('Progress updated:', response),
        //   (error) => console.error('Error updating progress:', error)
        // );
      }
    }, 2000);
  }

  getVideoQuality() {
    if (this.videoService.videoContent.video_file) {
      let src = this.videoService.videoContent.video_file.split('.mp4');
      this.videoSrc_120p = src[0] + '_120p.mp4';
      this.videoSrc_360p = src[0] + '_360p.mp4';
      this.videoSrc_720p = src[0] + '_720p.mp4';
      this.videoSrc_1080p = src[0] + '_1080p.mp4';
    }
  }

  setBitrate(bitrate: any) {
    console.log('Selected Bitrate:', bitrate);
  
    if (this.dashPlayer) {
      // Setzt die Qualität im DASH-Player
      this.dashPlayer.setQualityFor('video', bitrate.qualityIndex);
  
      // Aktualisiert die Videoquelle basierend auf der gewählten Qualität
      if (bitrate.label === '1080p') {
        this.updateVideoSource(this.videoSrc_1080p);
      } else if (bitrate.label === '720p') {
        this.updateVideoSource(this.videoSrc_720p);
      } else if (bitrate.label === '360p') {
        this.updateVideoSource(this.videoSrc_360p);
      } else if (bitrate.label === '120p') {
        this.updateVideoSource(this.videoSrc_120p);
      }
    } else {
      console.error('DASH player instance is not initialized!');
    }
  }

  updateVideoSource(newSource: string) {
    if (this.videoPlayer && this.videoPlayer.nativeElement instanceof HTMLMediaElement) {
      console.log(this.videoPlayer.nativeElement.currentTime);      
      console.log(this.videoService.videoContent.video_file);      
      let currentPlayedTime = this.videoPlayer.nativeElement.currentTime;
      // this.videoPlayer.nativeElement.src = newSource; // Setzt die neue Quelle
      this.videoService.videoContent.video_file = newSource;
      this.videoPlayer.nativeElement.load();         // Lädt das Video neu
      this.videoPlayer.nativeElement.play().then( () => {
        this.videoPlayer.nativeElement.currentTime = currentPlayedTime;
      });         // Startet die Wiedergabe automatisch (optional)
      console.log(this.videoPlayer.nativeElement.currentTime);
      console.log(this.videoService.videoContent.video_file);
      console.log('Video source updated to:', newSource);
    } else {
      console.error('Video player element is not a valid HTMLMediaElement!');
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.videoProgressInterval) {
      clearInterval(this.videoProgressInterval);
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';
import { IMediaElement, VgCoreModule, VgApiService, BitrateOptions } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import * as dashjs from 'dashjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  @ViewChild('videoPlayer', { static: false }) videoPlayer: any;
  videoProgressInterval: any;
  dashPlayer!: any;
  api!: VgApiService;
  subscriptions: Subscription = new Subscription();

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




  constructor(
    public videoService: VideoplayService,
    private http: HttpClient,
  ) {
    this.getVideoQuality();
    console.log('Watched?', this.videoService.videoContent.watched);
    console.log('Time:', this.videoService.videoStartTime);
  }

  // ngAfterViewInit() {
  //   if (this.videoPlayer.nativeElement && this.videoPlayer.nativeElement instanceof HTMLMediaElement) {
  //     if (typeof window !== 'undefined') {
  //       import('dashjs').then(dashjs => {
  //         this.dashPlayer = dashjs.MediaPlayer().create();
  //         this.dashPlayer.initialize(this.videoPlayer.nativeElement, this.videoService.videoContent.video_file, true);
  //         // this.dashPlayer.initialize(this.videoPlayer.nativeElement, this.videoService.videoContent.video_file, this.videoService.videoStartTime, true);
  //         this.dashPlayer.play();
  //         // this.videoPlayer.nativeElement.currentTime = this.videoService.videoStartTime

  //       }).catch(err => console.error('Failed to load Dash.js:', err));
  //     } else {
  //       console.log('Dash.js is not initialized because the code is running on the server.');
  //     }
  //     // this.trackVideoProgress();
  //   }
  // }

  onPlayerReady(api: VgApiService) {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.videoService.auth_token}`);
    this.api = api;
    const loadStartSub = this.api.getDefaultMedia().subscriptions.loadedData.subscribe(() => {
      if (this.videoService.videoStartTime) {
        console.log('CurrentTime:', this.api.getDefaultMedia().currentTime);
        console.log('StartTime:', this.videoService.videoStartTime);
        this.api.getDefaultMedia().currentTime = this.videoService.videoStartTime;
        console.log('CurrentTime:', this.api.getDefaultMedia().currentTime);
        console.log('StartTime:', this.videoService.videoStartTime);
      }
      this.api.getDefaultMedia().play()
      // setTimeout(() => {
      // }, 5000);
    });

    const endedSub = this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      this.deleteVideoProgess(headers);          
    });

    const timeUpdateSub = this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {

      const progressData = {
        video_id: this.videoService.videoContent.id,
        played_time: this.videoPlayer.nativeElement.currentTime,
        duration: this.videoPlayer.nativeElement.duration,
      };
      this.updateVideoProgess(progressData, headers);        
    });

    this.subscriptions.add(loadStartSub);
    this.subscriptions.add(endedSub);
    this.subscriptions.add(timeUpdateSub);
  }


  // trackVideoProgress() {
  //   const headers = new HttpHeaders().set('Authorization', `Token ${this.videoService.auth_token}`);
  //   this.videoProgressInterval = setInterval(() => {
  //     const videoElement = this.videoPlayer.nativeElement;
  //     const progressData = {
  //       video_id: this.videoService.videoContent.id,
  //       played_time: videoElement.currentTime,
  //       duration: videoElement.duration,
  //     };
  //     if (videoElement.currentTime == videoElement.duration) {
  //       // this.deleteVideoProgess();
  //       // this.dashPlayer.pause();
  //     } else {
  //       if (!videoElement.paused && videoElement.currentTime) {
  //         this.updateVideoProgess(progressData, headers);
  //       }
  //     }
  //   }, 2000);
  // }

  deleteVideoProgess(headers: HttpHeaders) {
    this.http.delete(`${environment.videoProgessURL}${this.videoService.videoContent.id}/delete_progress/`, { headers }).subscribe({
      next: () => {
        console.log('Progress deleted successfully');
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      },
      error: (err) => {
        console.error('Error deleting progress:', err);
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      },
    });
  }

  updateVideoProgess(progressData: any, headers: HttpHeaders) {
    this.http.post(`${environment.videoProgessURL}`, progressData, { headers }).subscribe({
      next: (response: any) => {
        // console.log('Progress updated:', response);
      },
      error: (error) => {
        console.error('Error updating progress:', error);
        if (this.videoProgressInterval) {
          clearInterval(this.videoProgressInterval);
        }
      }
    });
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
      this.dashPlayer.setQualityFor('video', bitrate.qualityIndex);
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
      let currentPlayedTime = this.videoPlayer.nativeElement.currentTime;
      this.videoService.videoContent.video_file = newSource;
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play().then(() => {
        this.videoPlayer.nativeElement.currentTime = currentPlayedTime;
      });
    } else {
      console.error('Video player element is not a valid HTMLMediaElement!');
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.videoProgressInterval) {
      clearInterval(this.videoProgressInterval);
    }
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}

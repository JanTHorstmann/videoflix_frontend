import { Component, Input } from '@angular/core';
import { VideoComponent } from '../video/video.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videoslideshow',
  standalone: true,
  imports: [
    CommonModule,
    VideoComponent,
  ],
  templateUrl: './videoslideshow.component.html',
  styleUrl: './videoslideshow.component.scss'
})
export class VideoslideshowComponent {

  @Input() categoryName: string = '';
  @Input() videos: any[] = [];


}

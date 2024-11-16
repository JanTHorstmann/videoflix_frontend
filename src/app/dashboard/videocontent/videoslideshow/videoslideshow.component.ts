import { Component, Input } from '@angular/core';
import { VideoComponent } from '../video/video.component';
import { CommonModule } from '@angular/common';

/**
 * VideoslideshowComponent displays a collection of videos in a slideshow format.
 * The component accepts a category name and a list of videos as input.
 */
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

    /**
   * The name of the category under which the videos are grouped.
   * This will be displayed as the category title.
   */
  @Input() categoryName: string = '';

    /**
   * An array of video objects that will be displayed in the slideshow.
   * Each video object contains details such as title, description, and video file.
   */
  @Input() videos: any[] = [];
}

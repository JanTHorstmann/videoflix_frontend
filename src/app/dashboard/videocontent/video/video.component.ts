import { Component, Input } from '@angular/core';

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
    src: string,
    thumbnail: string,
    created_at: string,    
  }

  constructor() {
    this.video = {
      title: '',
      description: '',
      src: '',
      thumbnail: '',
      created_at: '',
    }
  }
}

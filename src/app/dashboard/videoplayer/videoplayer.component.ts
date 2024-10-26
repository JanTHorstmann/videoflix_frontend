import { Component } from '@angular/core';
import { VideoplayService } from '../../services/videoplay.service';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  constructor(
    public videoService: VideoplayService,
  ) { } 


}

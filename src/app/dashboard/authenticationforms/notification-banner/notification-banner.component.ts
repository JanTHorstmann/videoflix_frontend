import { Component, Input } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss'
})
export class NotificationBannerComponent {

  @Input() bannerNotice!: string

  constructor(
    public videoservice: VideoplayService
  ) {

  }

}

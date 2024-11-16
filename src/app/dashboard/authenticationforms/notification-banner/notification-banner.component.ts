import { Component, Input } from '@angular/core';
import { VideoplayService } from '../../../services/videoplay.service';

/**
 * Component for displaying a notification banner.
 * 
 * This component is used to show temporary notifications or messages to the user.
 */
@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss'
})
export class NotificationBannerComponent {

    /**
   * The message to display in the notification banner.
   * This input is provided by the parent component.
   */
  @Input() bannerNotice!: string

    /**
   * @param videoservice - Service used for managing video playback state and UI interactions.
   */
  constructor(
    public videoservice: VideoplayService
  ) { }

}

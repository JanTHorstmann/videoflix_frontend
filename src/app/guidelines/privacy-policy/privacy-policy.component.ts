import { Component } from '@angular/core';
import { NavbarComponent } from '../../dashboard/navbar/navbar.component';

/**
 * PrivacyPolicyComponent is responsible for displaying the privacy policy of the website.
 * It includes the NavbarComponent for navigation purposes.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    NavbarComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  /**
   * A string representing the visibility of the navbar button.
   * The default is hidden ('display: none;').
   */
  navbarButton: string = 'display: none;'
}

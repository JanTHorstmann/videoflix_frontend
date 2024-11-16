import { Component } from '@angular/core';
import { NavbarComponent } from '../../dashboard/navbar/navbar.component';

/**
 * ImprintComponent is responsible for displaying the imprint or legal information on the website.
 * It includes the NavbarComponent for navigation purposes.
 */
@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [
    NavbarComponent,
  ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

    /**
   * A string representing the visibility of the navbar button.
   * The default is hidden ('display: none;').
   */
  navbarButton: string = 'display: none;'
}

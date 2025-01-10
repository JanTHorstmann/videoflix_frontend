import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

/**
 * Component for handling email confirmation.
 * 
 * This component retrieves a token from the URL's query parameters,
 * sends a request to confirm the user's email, and redirects to the login page upon success.
 */
@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [
    HttpClientModule,
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {

    /**
   * The token extracted from the query parameters for email confirmation.
   */
  token!: string;

    /**
   * @param activatedRoute - Provides access to the current route's query parameters.
   * @param http - Handles HTTP requests to confirm the email token.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) { }

    /**
   * Angular lifecycle hook that initializes the component.
   * 
   * This method:
   * - Subscribes to the query parameters to retrieve the token.
   * - Sends a confirmation request using the extracted token.
   * - Redirects the user to the login page upon successful confirmation.
   */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    const confirmUrl = `${environment.confirmURL}?token=${this.token}`;

    this.http.get(confirmUrl).subscribe({
      next: (response: any) => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Fehler beim Bestätigen:', error);
      }
    });
  }

}

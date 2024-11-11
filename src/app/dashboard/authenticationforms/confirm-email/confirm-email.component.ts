import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

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

  token!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    // Holen des Tokens aus den URL-Query-Parametern
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

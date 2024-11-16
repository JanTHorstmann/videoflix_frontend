import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard is a route guard that prevents unauthorized users from accessing certain routes.
 * It checks if the user is logged in by using the AuthService.
 * If the user is logged in, the route is activated; otherwise, the user is redirected to the login page.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    /**
   * Creates an instance of the AuthGuard.
   * @param authService The AuthService used to check if the user is logged in.
   * @param router The Angular Router used for navigation.
   */
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

    /**
   * Determines if a route can be activated based on the user's authentication status.
   * If the user is logged in, the route is activated. If not, the user is redirected to the login page.
   * @returns {boolean} `true` if the user is logged in, otherwise `false`.
   */
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Leite den Benutzer zur Login-Seite weiter
      this.router.navigate(['/login']);
      return false;
    }
  }
}

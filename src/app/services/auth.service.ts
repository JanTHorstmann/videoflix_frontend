import { Injectable } from '@angular/core';

/**
 * AuthService is responsible for managing the user's authentication state.
 * It provides methods for checking if the user is logged in, logging in by setting an authentication token,
 * and logging out by removing the token from localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Creates an instance of AuthService.
   */
  constructor() { }

  /**
   * Checks if the user is logged in by verifying the presence of an authentication token in localStorage or sessionStorage.
   * @returns {boolean} `true` if the user is logged in, otherwise `false`.
   */
  isLoggedIn(): boolean {
    let auth_token = localStorage.getItem('auth_token');
    let session_token = sessionStorage.getItem('auth_token');
    if (auth_token || session_token) {
      return true
    } else {
      return false;
    }
  }

  /**
   * Logs the user in by storing the authentication token in localStorage.
   * @param token The authentication token to be stored.
   */
  login(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Logs the user out by removing the authentication token from localStorage.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}

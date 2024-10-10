import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

    // Eine einfache Methode, um zu überprüfen, ob der Benutzer eingeloggt ist
    isLoggedIn(): boolean {
      // Hier kannst du z.B. den Token aus dem lokalen Speicher oder einer anderen Quelle prüfen
      let auth_token = localStorage.getItem('auth_token');
      if (auth_token) {
        return true
      } else {
        return false;
      }
    }
  
    // Beispiel-Methode zum Einloggen
    login(token: string): void {
      localStorage.setItem('auth_token', token);
    }
  
    // Beispiel-Methode zum Ausloggen
    logout(): void {
      localStorage.removeItem('auth_token');
    }
}

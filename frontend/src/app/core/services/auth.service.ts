import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'keep_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserProfile(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  loginWithToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/']);
  }

  // --- STANDARD LOGIN ---
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post('/auth/login', credentials).pipe(
      tap((res: any) => {
        if (res && res.access_token) {
          this.loginWithToken(res.access_token);
        }
      })
    );
  }

  // --- STANDARD REGISTER ---
  register(userData: { name?: string; email: string; password: string }): Observable<any> {
    return this.apiService.post('/auth/register', userData).pipe(
      tap((res: any) => {
        if (res && res.access_token) {
          this.loginWithToken(res.access_token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  loginWithGoogle() {
    // Redirige al endpoint del backend que inicia el flujo de OAuth
    window.location.href = `${this.apiService.getBaseUrl()}/auth/google`;
  }
}
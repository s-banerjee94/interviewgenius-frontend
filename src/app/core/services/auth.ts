import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse, User } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_TYPE_KEY = 'token_type';
  private readonly EXPIRES_AT_KEY = 'expires_at';
  private readonly USER_KEY = 'user_data';

  // Signal to track authentication state
  private authStateSignal = signal<boolean>(this.checkAuthState());

  // Computed signal for external consumption
  isAuthenticated = computed(() => this.authStateSignal());

  private checkAuthState(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired
    if (Date.now() >= parseInt(expiresAt, 10)) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        this.storeAuthData(response);
      })
    );
  }

  private storeAuthData(response: LoginResponse): void {
    // Store token
    localStorage.setItem(this.TOKEN_KEY, response.token);

    // Store token type
    localStorage.setItem(this.TOKEN_TYPE_KEY, response.tokenType);

    // Calculate and store expiration timestamp
    const expiresAt = Date.now() + (response.expiresIn * 1000); // Convert seconds to milliseconds
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());

    // Decode JWT to extract user info
    const userInfo = this.decodeToken(response.token);
    if (userInfo) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
    }

    // Update auth state signal
    this.authStateSignal.set(true);
  }

  private decodeToken(token: string): Partial<User> | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      // Extract user info from JWT payload
      return {
        id: decoded.user_id,
        email: decoded.email || decoded.sub,
        role: decoded.role,
        firstName: decoded.first_name || '',
        lastName: decoded.last_name || '',
        profilePicture: decoded.profile_picture,
        authProviders: decoded.auth_providers || [],
        isActive: true,
        isVerified: true,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    const tokenType = this.getTokenType();
    return token && tokenType ? `${tokenType} ${token}` : null;
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    this.clearAuthData();
    // Update auth state signal
    this.authStateSignal.set(false);
  }

  initiateGoogleLogin(): void {
    // Redirect to backend OAuth2 authorization endpoint
    window.location.href = `${this.apiUrl.replace('/auth', '')}/oauth2/authorization/google`;
  }

  initiateGitHubLogin(): void {
    // Redirect to backend OAuth2 authorization endpoint
    window.location.href = `${this.apiUrl.replace('/auth', '')}/oauth2/authorization/github`;
  }

  handleOAuthCallback(token: string, tokenType: string, expiresIn: number): void {
    // Store the token, token type, and calculate expiration
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType);

    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());

    // Decode JWT to extract user info
    const userInfo = this.decodeToken(token);
    if (userInfo) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
    }

    // Update auth state signal
    this.authStateSignal.set(true);
  }
}

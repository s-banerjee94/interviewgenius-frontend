import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const messageService = inject(MessageService);

  // Skip adding auth header for authentication endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') ||
                        req.url.includes('/auth/signup') ||
                        req.url.includes('/oauth2/authorization');

  if (isAuthEndpoint) {
    return next(req);
  }

  // PROACTIVE CHECK: Verify token is not expired before sending request
  const expiresAt = authService.getExpiresAt();
  if (expiresAt && Date.now() >= expiresAt) {
    // Token is expired, logout and redirect
    authService.logout();
    messageService.add({
      severity: 'warn',
      summary: 'Session Expired',
      detail: 'Your session has expired. Please login again.',
    });
    router.navigate(['/signin']);

    // Don't send the request
    return throwError(() => new Error('Token expired'));
  }

  // Get the authorization header from the auth service
  const authHeader = authService.getAuthorizationHeader();

  // If token exists, clone the request and add the Authorization header
  let clonedReq = req;
  if (authHeader) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        messageService.add({
          severity: 'error',
          summary: 'Connection Error',
          detail: 'Internal problem occurred. Please try again after some time.',
        });
      } else if (error.status === 401) {
        authService.logout();
        messageService.add({
          severity: 'warn',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please login again.',
        });
        router.navigate(['/signin']);
      }
      return throwError(() => error);
    })
  );
};

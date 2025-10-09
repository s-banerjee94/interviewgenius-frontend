import { Injectable, ErrorHandler as AngularErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements AngularErrorHandler {

  handleError(error: Error): void {
    // Log error to console in development
    console.error('Global Error Handler:', error);

    // TODO: Add error logging service (e.g., Sentry, LogRocket)
    // TODO: Show user-friendly error messages

    // You can add custom error handling logic here
    if (error.message.includes('ChunkLoadError')) {
      console.error('Failed to load application chunk. Please refresh the page.');
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-oauth-callback',
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.css'
})
export class OauthCallback implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(Auth);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const tokenType = params['tokenType'] || 'Bearer';
      const expiresIn = params['expiresIn'] ? parseInt(params['expiresIn'], 10) : 86400; // Default 24 hours

      if (token) {
        // Store auth data
        this.authService.handleOAuthCallback(token, tokenType, expiresIn);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.showErrorAndRedirect('Authentication failed');
      }
    });
  }

  private showErrorAndRedirect(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });

    setTimeout(() => {
      this.router.navigate(['/signin']);
    }, 2000);
  }
}

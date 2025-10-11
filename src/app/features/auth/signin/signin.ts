import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-signin',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  private readonly authService = inject(Auth);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  formData: LoginRequest = {
    email: '',
    password: ''
  };

  isLoading = false;

  onSubmit(form: NgForm): void {
    if (form.valid && !this.isLoading) {
      this.isLoading = true;

      this.authService.login(this.formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Welcome back, ${response.user.firstName}!`,
          });

          // Navigate to home/dashboard after successful login
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Login failed. Please check your credentials.',
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  loginWithGoogle(): void {
    console.log('Login with Google clicked');
    // TODO: Implement Google OAuth integration with Keycloak
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Google login will be implemented with Keycloak',
      life: 3000
    });
  }

  loginWithGitHub(): void {
    console.log('Login with GitHub clicked');
    // TODO: Implement GitHub OAuth integration with Keycloak
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'GitHub login will be implemented with Keycloak',
      life: 3000
    });
  }
}

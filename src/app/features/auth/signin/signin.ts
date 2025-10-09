import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';

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
  formData = {
    email: '',
    password: ''
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form submitted:', this.formData);
      // TODO: Implement actual signin logic with backend/Keycloak
      // For now, just log the data
      alert('Sign in successful! Check console for data.');
    }
  }

  loginWithGoogle(): void {
    console.log('Login with Google clicked');
    // TODO: Implement Google OAuth integration with Keycloak
    alert('Google login will be implemented with Keycloak');
  }

  loginWithGitHub(): void {
    console.log('Login with GitHub clicked');
    // TODO: Implement GitHub OAuth integration with Keycloak
    alert('GitHub login will be implemented with Keycloak');
  }
}

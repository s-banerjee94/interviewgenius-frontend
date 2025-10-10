import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private keycloak = inject(Keycloak);

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form submitted:', this.formData);
      // TODO: Implement actual signup logic with backend/Keycloak
      // For now, just log the data
      alert('Signup successful! Check console for data.');
    }
  }

  loginWithGoogle(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + '/dashboard',
      idpHint: 'google'
    });
  }

  loginWithGitHub(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + '/dashboard',
      idpHint: 'github'
    });
  }
}

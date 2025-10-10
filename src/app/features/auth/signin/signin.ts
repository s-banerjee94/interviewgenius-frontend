import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import Keycloak from 'keycloak-js';

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
export class Signin implements OnInit {
  private keycloak = inject(Keycloak);
  private route = inject(ActivatedRoute);

  formData = {
    email: '',
    password: ''
  };

  private returnUrl = '/dashboard';

  ngOnInit() {
    // Get the return URL from query params, default to /dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form submitted:', this.formData);
      // TODO: Implement actual signin logic with backend/Keycloak
      // For now, just log the data
      alert('Sign in successful! Check console for data.');
    }
  }

  loginWithGoogle(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + this.returnUrl,
      idpHint: 'google'
    });
  }

  loginWithGitHub(): void {
    this.keycloak.login({
      redirectUri: window.location.origin + this.returnUrl,
      idpHint: 'github'
    });
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KeycloakProfile } from 'keycloak-js';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CardModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private keycloak = inject(Keycloak);

  userProfile = signal<KeycloakProfile | null>(null);
  isLoggedIn = signal<boolean>(false);

  async ngOnInit() {
    this.isLoggedIn.set(this.keycloak.authenticated ?? false);

    if (this.isLoggedIn()) {
      try {
        const profile = await this.keycloak.loadUserProfile();
        this.userProfile.set(profile);
      } catch (error) {
        console.error('Failed to load user profile', error);
      }
    }
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}

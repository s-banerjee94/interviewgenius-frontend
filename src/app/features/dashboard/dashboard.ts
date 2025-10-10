import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CardModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  // Inject User Service - single source of truth for all user data
  userService = inject(User);

  // All user data comes from the service (pre-loaded by resolver)
  userProfile = this.userService.userProfile;
  isLoggedIn = this.userService.isAuthenticated;
  userRoles = this.userService.userRoles;

  logout() {
    this.userService.logout();
  }
}

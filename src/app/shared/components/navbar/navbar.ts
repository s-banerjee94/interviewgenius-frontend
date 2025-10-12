import {Component, signal, computed, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {Menubar} from 'primeng/menubar';
import {Avatar} from 'primeng/avatar';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {Auth} from '../../../core/services/auth';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Menubar, Button, RouterLink, Avatar, Menu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  isDarkMode = signal(false);
  isAuthenticated = this.authService.isAuthenticated;
  user = computed(() => this.authService.getUser());
  profilePicture = computed(() => {
    const userData = this.user();
    return userData?.profilePicture || null;
  });
  userInitials = computed(() => {
    const userData = this.user();
    if (!userData) return 'U';

    // If firstName and lastName exist, use them
    if (userData.firstName && userData.lastName) {
      const firstInitial = userData.firstName.charAt(0);
      const lastInitial = userData.lastName.charAt(0);
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    // Fallback to email initials
    if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }

    return 'U';
  });
  fullName = computed(() => {
    const userData = this.user();
    if (!userData) return '';

    // If firstName and lastName exist, use them
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }

    // Fallback to email
    return userData.email || 'User';
  });

  menuItems = computed<MenuItem[]>(() => [
    {
      label: this.fullName(),
      disabled: true,
      styleClass: 'font-semibold'
    },
    {
      separator: true
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ]);

  menubar = {
    root: {
      borderColor: 'transparent',
      borderRight: 'none',
    }
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('ig-dark');
    this.isDarkMode.set(!this.isDarkMode());
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}

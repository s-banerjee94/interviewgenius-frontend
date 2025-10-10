import {Component, signal, inject, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {Menubar} from 'primeng/menubar';
import {Avatar} from 'primeng/avatar';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {User} from '../../../core/services/user';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, Button, RouterLink, Avatar, Menu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // Inject user service - provides all user data from Keycloak
  userService = inject(User);
  router = inject(Router);

  @ViewChild('userMenu') userMenu!: Menu;

  isDarkMode = signal(false);

  // Get user data from service (all computed signals, safe to use)
  isAuthenticated = this.userService.isAuthenticated;
  userDisplayName = this.userService.userDisplayName;
  userInitials = this.userService.userInitials;
  userProfilePicture = this.userService.userProfilePicture;

  userMenuItems: MenuItem[] = [
    {
      label: this.userDisplayName(),
      disabled: true,
      styleClass: 'font-bold'
    },
    {
      separator: true
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateToProfile()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  menubar = {
    root: {
      borderColor: 'none',
      borderRadius: 'none',
    }
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('ig-dark');
    this.isDarkMode.set(!this.isDarkMode());
  }

  toggleUserMenu(event: Event) {
    this.userMenu.toggle(event);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.userService.logout();
  }
}

import {Component, signal, computed, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {Menubar} from 'primeng/menubar';
import {Auth} from '../../../core/services/auth';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Menubar, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  isDarkMode = signal(false);
  isAuthenticated = this.authService.isAuthenticated;

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

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}

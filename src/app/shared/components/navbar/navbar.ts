import {Component, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, Button],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isDarkMode = signal(false);

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
}

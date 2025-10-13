import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly userService = inject(UserService);
  private readonly authService = inject(Auth);

  userDetailsResponse: string = '';
  isLoading = false;

  getUserDetails(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.userDetailsResponse = 'No user logged in';
      return;
    }

    this.isLoading = true;

    this.userService.getUserById(user.id).subscribe({
      next: (response) => {
        this.userDetailsResponse = JSON.stringify(response, null, 2);
        this.isLoading = false;
      },
      error: (error) => {
        this.userDetailsResponse = JSON.stringify(error, null, 2);
        this.isLoading = false;
      }
    });
  }
}

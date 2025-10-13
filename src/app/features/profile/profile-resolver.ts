import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { UserResponse } from '../../shared/models/user.model';
import { catchError, of } from 'rxjs';

export const profileResolver: ResolveFn<UserResponse | null> = (route, state) => {
  const userService = inject(UserService);
  const authService = inject(Auth);

  const user = authService.getUser();

  if (!user || !user.id) {
    return of(null);
  }

  return userService.getUserById(user.id).pipe(
    catchError((error) => {
      console.error('Error fetching user profile:', error);
      return of(null);
    })
  );
};

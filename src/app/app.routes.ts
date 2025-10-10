import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup)
  },
  {
    path: 'signin',
    loadComponent: () => import('./features/auth/signin/signin').then(m => m.Signin)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/forbidden/forbidden').then(m => m.Forbidden)
  }
];

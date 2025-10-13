import { Routes } from '@angular/router';

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
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/oauth-callback/oauth-callback').then(m => m.OauthCallback)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  }
];

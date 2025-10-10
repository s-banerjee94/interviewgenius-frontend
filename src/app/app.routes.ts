import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {dashboardResolver} from './features/dashboard/resolvers/dashboard-resolver';

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
    canActivate: [authGuard],
    resolve: {
      profileLoaded: dashboardResolver
    }
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/forbidden/forbidden').then(m => m.Forbidden)
  }
];

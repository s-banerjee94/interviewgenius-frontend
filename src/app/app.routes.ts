import { Routes } from '@angular/router';
import { profileResolver } from './features/profile/profile-resolver';
import { authGuard } from './core/guards/auth-guard';

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
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
    resolve: {
      profile: profileResolver
    }
  },
  {
    path: 'resume',
    loadComponent: () => import('./features/resume/resume').then(m => m.Resume),
    canActivate: [authGuard]
  },
  {
    path: 'session/:sessionId',
    loadComponent: () => import('./features/session-details/session-details').then(m => m.SessionDetails),
    canActivate: [authGuard]
  },
  {
    path: 'interview/:sessionId',
    loadComponent: () => import('./features/interview/interview').then(m => m.Interview),
    canActivate: [authGuard]
  }
];

import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Guard function to check if user is authenticated and has required roles
 * @param route - The route being accessed
 * @param state - Current router state
 * @param authData - Authentication data provided by Keycloak
 * @returns true if access allowed, UrlTree for redirect if denied
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);

  // Check 1: User must be authenticated
  if (!authenticated) {
    // User is not authenticated, redirect to signin
    return router.parseUrl('/signin');
  }

  // Check 2: User must have either USER or ADMIN role
  const requiredRoles = ['USER', 'ADMIN'];
  const hasRequiredRole = requiredRoles.some(role =>
    grantedRoles.realmRoles.includes(role)
  );

  if (hasRequiredRole) {
    return true;
  }

  // User is authenticated but doesn't have required role
  // Redirect to forbidden page
  return router.parseUrl('/forbidden');
};

/**
 * Auth guard to protect routes that require authentication and USER or ADMIN role
 * Usage: Add to canActivate array in route configuration
 */
export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);

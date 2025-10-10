import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '../../../core/services/user';

/**
 * Dashboard Resolver - Pre-loads full user profile before dashboard activates
 *
 * This resolver uses the User Service to load the full profile from Keycloak API.
 * The User Service is the single source of truth for all user data.
 *
 * Benefits:
 * - Data available immediately when component loads
 * - No loading states needed in component
 * - Better user experience
 * - Delegates to User Service (no duplication)
 */
export const dashboardResolver: ResolveFn<boolean> = async (route, state) => {
  const userService = inject(User);

  // Load full user profile from Keycloak API
  // This will be stored in the User Service and available to all components
  await userService.loadProfile();

  // Return true to indicate resolver completed successfully
  return true;
};

import { Injectable, inject, computed, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KeycloakProfile } from 'keycloak-js';

/**
 * User Service - Single source of truth for user data from Keycloak
 *
 * This service provides two levels of user data:
 * 1. Token data (fast, synchronous) - from JWT token already in memory
 *    - Used by: Navbar, guards, quick checks
 * 2. Full profile (async, when needed) - from Keycloak API
 *    - Used by: Dashboard, profile pages, detailed user info
 *
 * Benefits:
 * - Single source of truth - no duplication
 * - Efficient - token data doesn't require API calls
 * - Flexible - can load full profile when needed
 * - Reactive - all data as signals for automatic UI updates
 */
@Injectable({
  providedIn: 'root'
})
export class User {
  private keycloak = inject(Keycloak);

  // Full user profile (loaded on demand via loadProfile())
  private profileSignal = signal<KeycloakProfile | null>(null);

  // Authentication state (from token)
  isAuthenticated = computed(() => this.keycloak.authenticated ?? false);

  // User display name (from token - fast, no API call)
  userDisplayName = computed(() => {
    if (!this.isAuthenticated()) return 'Guest';

    const tokenParsed = this.keycloak.tokenParsed;
    return tokenParsed?.['name'] || tokenParsed?.['preferred_username'] || tokenParsed?.['email'] || 'User';
  });

  // User initials for avatar (from token - fast)
  userInitials = computed(() => {
    if (!this.isAuthenticated()) return 'G';

    const name = this.userDisplayName();
    const parts = name.split(' ').filter((p: string) => p.length > 0);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  // User roles (from token - fast)
  userRoles = computed(() => {
    if (!this.isAuthenticated()) return [];
    return this.keycloak.realmAccess?.roles ?? [];
  });

  // User profile picture URL (from token - Google/GitHub provide this)
  userProfilePicture = computed(() => {
    if (!this.isAuthenticated()) return null;

    const tokenParsed = this.keycloak.tokenParsed;

    // Check for 'picture' claim (standard OIDC claim used by Google, GitHub, etc.)
    const pictureUrl = tokenParsed?.['picture'];
    if (pictureUrl) {
      return pictureUrl as string;
    }

    // Check for 'avatar_url' (sometimes used by GitHub)
    const avatarUrl = tokenParsed?.['avatar_url'];
    if (avatarUrl) {
      return avatarUrl as string;
    }
    return null;
  });

  // Full user profile (loaded via loadProfile() - for dashboard, profile pages)
  userProfile = computed(() => this.profileSignal());

  /**
   * Load full user profile from Keycloak API
   * Call this in resolvers or components that need detailed user info
   */
  async loadProfile(): Promise<KeycloakProfile | null> {
    if (!this.isAuthenticated()) {
      this.profileSignal.set(null);
      return null;
    }

    try {
      const profile = await this.keycloak.loadUserProfile();
      this.profileSignal.set(profile);
      return profile;
    } catch (error) {
      console.error('Failed to load user profile', error);
      this.profileSignal.set(null);
      return null;
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.userRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Logout user and clear all data
   */
  logout(): void {
    this.profileSignal.set(null);
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }
}

import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { Avatar } from 'primeng/avatar';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { UserService } from '../../core/services/user';
import { UserResponse, Experience } from '../../shared/models/user.model';

interface ExperienceLevel {
  label: string;
  value: Experience;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule, Card, InputText, Button, Password, Avatar, Select, Toast, Message],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  // Edit mode state
  isEditMode = signal(false);
  isLoading = signal(false);

  // Store user ID
  private userId: number | null = null;

  // Original values (for change detection and cancel)
  private originalValues: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    experience: Experience | undefined;
  } = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    experience: undefined
  };

  // General Information signals
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phoneNumber = signal('');
  experience = signal<Experience | undefined>(undefined);

  // Experience level options
  experienceLevels: ExperienceLevel[] = [
    { label: 'Fresher (0-2 years)', value: Experience.FRESHER },
    { label: 'Intermediate (3-5 years)', value: Experience.INTERMEDIATE },
    { label: 'Experienced (6+ years)', value: Experience.EXPERIENCED }
  ];

  // Password fields
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Store profile picture and auth providers
  profilePicture = signal<string | null>(null);
  authProviders = signal<string[]>([]);

  // Computed signal to check if user has local password
  hasLocalAuth = computed(() => {
    return this.authProviders().includes('LOCAL');
  });

  // Computed signal for OAuth info message
  oauthInfoMessage = computed(() => {
    const providers = this.authProviders().filter(p => p !== 'LOCAL');
    if (providers.length === 0) return '';
    return `You signed in with ${providers.join(', ')}. Set a password to also enable email/password login for your account.`;
  });

  // Computed signal for user initials
  getInitials = computed(() => {
    const first = this.firstName();
    const last = this.lastName();

    // If firstName and lastName exist, use them
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }

    // Fallback to email initials
    if (this.email()) {
      return this.email().charAt(0).toUpperCase();
    }

    return 'U';
  });

  // Computed signal to check if there are changes
  hasChanges = computed(() => {
    return (
      this.firstName() !== this.originalValues.firstName ||
      this.lastName() !== this.originalValues.lastName ||
      this.email() !== this.originalValues.email ||
      this.phoneNumber() !== this.originalValues.phoneNumber ||
      this.experience() !== this.originalValues.experience
    );
  });

  constructor() {
    this.loadUserData();
  }

  loadUserData() {
    const profileData = this.route.snapshot.data['profile'] as UserResponse | null;

    if (profileData) {
      this.userId = profileData.id;
      this.firstName.set(profileData.firstName || '');
      this.lastName.set(profileData.lastName || '');
      this.email.set(profileData.email || '');
      this.phoneNumber.set(profileData.phoneNumber || '');
      this.experience.set(profileData.experience);
      this.profilePicture.set(profileData.profileImageUrl || null);
      this.authProviders.set(profileData.authProviders || []);

      // Store original values
      this.storeOriginalValues();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load profile data'
      });
    }
  }

  storeOriginalValues() {
    this.originalValues = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phoneNumber: this.phoneNumber(),
      experience: this.experience()
    };
  }

  editProfile() {
    this.isEditMode.set(true);
  }

  saveChanges() {
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID not found'
      });
      return;
    }

    this.isLoading.set(true);

    const updateData = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phoneNumber: this.phoneNumber() || undefined,
      experience: this.experience()
    };

    this.userService.updateUser(this.userId, updateData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully'
        });

        // Update with latest data from backend
        this.firstName.set(response.firstName);
        this.lastName.set(response.lastName);
        this.email.set(response.email);
        this.phoneNumber.set(response.phoneNumber || '');
        this.experience.set(response.experience);
        this.profilePicture.set(response.profileImageUrl || null);

        // Store new original values
        this.storeOriginalValues();
        this.isEditMode.set(false);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update profile'
        });
        this.isLoading.set(false);
      }
    });
  }

  cancelEdit() {
    // Restore original values
    this.firstName.set(this.originalValues.firstName);
    this.lastName.set(this.originalValues.lastName);
    this.email.set(this.originalValues.email);
    this.phoneNumber.set(this.originalValues.phoneNumber);
    this.experience.set(this.originalValues.experience);

    this.isEditMode.set(false);
  }

  hasPasswordChanges(): boolean {
    // For OAuth users (no local auth), only new password and confirm are required
    if (!this.hasLocalAuth()) {
      return (
        this.newPassword.trim() !== '' &&
        this.confirmPassword.trim() !== ''
      );
    }

    // For local auth users, all three fields are required
    return (
      this.oldPassword.trim() !== '' &&
      this.newPassword.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    );
  }

  updatePassword() {
    // Validate passwords match
    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New password and confirm password do not match'
      });
      return;
    }

    // Validate password strength (minimum 6 characters as per API)
    if (this.newPassword.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password must be at least 6 characters long'
      });
      return;
    }

    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID not found'
      });
      return;
    }

    this.isLoading.set(true);

    // For OAuth users without local auth, send empty string for oldPassword
    // Backend should handle this case for first-time password setup
    const passwordData = {
      oldPassword: this.hasLocalAuth() ? this.oldPassword : '',
      newPassword: this.newPassword
    };

    this.userService.changePassword(this.userId, passwordData).subscribe({
      next: () => {
        const isFirstTimeSetup = !this.hasLocalAuth();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: isFirstTimeSetup
            ? 'Password set successfully'
            : 'Password changed successfully'
        });

        // Update auth providers to include LOCAL after setting password
        if (isFirstTimeSetup) {
          const currentProviders = this.authProviders();
          this.authProviders.set([...currentProviders, 'LOCAL']);
        }

        // Clear password fields
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to update password'
        });
        this.isLoading.set(false);
      }
    });
  }
}

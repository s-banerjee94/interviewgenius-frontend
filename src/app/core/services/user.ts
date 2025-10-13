import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserResponse,
  UpdateUserRequest,
  ChangePasswordRequest
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/users';

  /**
   * Get user profile by ID
   * GET /users/{id}
   */
  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${userId}`);
  }

  /**
   * Update user profile
   * PUT /users/{id}
   */
  updateUser(userId: number, data: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${userId}`, data);
  }

  /**
   * Change user password
   * PATCH /users/{id}/change-password
   */
  changePassword(userId: number, data: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${userId}/change-password`, data);
  }
}

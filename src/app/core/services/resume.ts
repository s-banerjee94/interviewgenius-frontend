import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Resume,
  WorkExperience,
  Education,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  CreateEducationRequest,
  UpdateEducationRequest,
  CreateResumeRequest,
  UpdateResumeRequest,
  ResumeUploadResponse
} from '../../shared/models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1';

  // Get user's resume
  getResume(userId: number): Observable<Resume> {
    return this.http.get<Resume>(`${this.baseUrl}/users/${userId}/resume`);
  }

  // Create or update user's resume
  saveResume(userId: number, data: CreateResumeRequest | UpdateResumeRequest): Observable<Resume> {
    return this.http.put<Resume>(`${this.baseUrl}/users/${userId}/resume`, data);
  }

  // Upload resume PDF
  uploadResumePdf(file: File, userId: number): Observable<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    return this.http.post<Resume>(`${this.baseUrl}/users/upload-pdf`, formData);
  }
}

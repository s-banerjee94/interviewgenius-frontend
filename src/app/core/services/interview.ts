import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateInterviewSessionRequest,
  CreateInterviewSessionResponse,
  InterviewSession,
  QuestionDto,
  AnswerSubmissionResponseDto,
  SessionListDto,
  SessionDetailsDto
} from '../../shared/models/interview.model';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(Auth);
  private readonly baseUrl = 'http://localhost:8080/api/v1/interviews';

  // Current session state
  currentSession = signal<InterviewSession | null>(null);

  /**
   * Create a new interview session
   */
  createSession(data: CreateInterviewSessionRequest): Observable<CreateInterviewSessionResponse> {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    return this.http.post<CreateInterviewSessionResponse>(
      `${this.baseUrl}/start/${user.id}`,
      null,
      {
        params: {
          experienceLevel: data.experienceLevel,
          language: data.language
        }
      }
    );
  }

  /**
   * Get interview session by ID
   */
  getSession(sessionId: string): Observable<InterviewSession> {
    return this.http.get<InterviewSession>(`${this.baseUrl}/${sessionId}`);
  }

  /**
   * Update current session state
   */
  setCurrentSession(session: InterviewSession | null): void {
    this.currentSession.set(session);
  }

  /**
   * Clear current session
   */
  clearCurrentSession(): void {
    this.currentSession.set(null);
  }

  /**
   * Get the first question for an interview session
   */
  getFirstQuestion(sessionId: string): Observable<QuestionDto> {
    return this.http.get<QuestionDto>(`${this.baseUrl}/${sessionId}/question`);
  }

  /**
   * Submit answer (audio/video file) for the current question
   */
  submitAnswer(sessionId: string, file: File): Observable<AnswerSubmissionResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<AnswerSubmissionResponseDto>(
      `${this.baseUrl}/${sessionId}/answer`,
      formData
    );
  }

  /**
   * End an interview session
   */
  endSession(sessionId: string, force: boolean = true): Observable<InterviewSession> {
    return this.http.post<InterviewSession>(
      `${this.baseUrl}/${sessionId}/end`,
      null,
      {
        params: {
          force: force.toString()
        }
      }
    );
  }

  /**
   * Get all interview sessions for a user
   */
  getAllSessions(userId: string): Observable<SessionListDto[]> {
    return this.http.get<SessionListDto[]>(`${this.baseUrl}/sessions/${userId}`);
  }

  /**
   * Get session details by ID
   */
  getSessionDetails(sessionId: string): Observable<SessionDetailsDto> {
    return this.http.get<SessionDetailsDto>(`${this.baseUrl}/${sessionId}/details`);
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { InterviewService } from '../../core/services/interview';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InterviewSetup } from '../interview-setup/interview-setup';
import { SessionListDto } from '../../shared/models/interview.model';
import { DatePipe } from '@angular/common';

interface ExperienceLevel {
  label: string;
  value: string;
}

interface ProgrammingLanguage {
  name: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    TableModule,
    TooltipModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(Auth);
  private readonly interviewService = inject(InterviewService);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  // Form data
  selectedExperience = signal<ExperienceLevel | null>(null);
  selectedLanguage = signal<ProgrammingLanguage | null>(null);

  // Sessions data
  sessions = signal<SessionListDto[]>([]);

  // Dropdown options
  experienceLevels: ExperienceLevel[] = [
    { label: 'Fresher', value: 'FRESHER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Experienced', value: 'EXPERIENCED' }
  ];

  programmingLanguages: ProgrammingLanguage[] = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C++', value: 'cpp' },
    { name: 'C#', value: 'csharp' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' },
    { name: 'PHP', value: 'php' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Swift', value: 'swift' },
    { name: 'Kotlin', value: 'kotlin' }
  ];

  // Get user's first name for welcome message
  get userName(): string {
    const user = this.authService.getUser();
    return user?.firstName || 'User';
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated'
      });
      return;
    }

    this.interviewService.getAllSessions(user.id.toString()).subscribe({
      next: (sessions) => {
        this.sessions.set(sessions);
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load interview sessions'
        });
      }
    });
  }

  startSession(): void {
    if (!this.selectedExperience()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select your experience level'
      });
      return;
    }

    if (!this.selectedLanguage()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select a programming language'
      });
      return;
    }

    // Open interview setup dialog with configuration data
    const dialogRef = this.dialogService.open(InterviewSetup, {
      header: 'Interview Setup',
      width: '90vw',
      height: '90vh',
      maximizable: true,
      closable: true,
      data: {
        experienceLevel: this.selectedExperience()!.value,
        language: this.selectedLanguage()!.value
      }
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((success: boolean | undefined) => {
        if (success) {
          // User completed all tests, get session from service
          const session = this.interviewService.currentSession();

          if (session) {
            this.messageService.add({
              severity: 'success',
              summary: 'Setup Complete',
              detail: 'Starting your interview session...'
            });

            // Navigate to interview page with session ID
            this.router.navigate(['/interview', session.sessionId]);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Session Error',
              detail: 'Failed to retrieve session data'
            });
          }
        } else if (success === false) {
          // User cancelled setup or error occurred
          this.messageService.add({
            severity: 'info',
            summary: 'Setup Cancelled',
            detail: 'Interview setup was cancelled'
          });
        }
      });
    }
  }
}

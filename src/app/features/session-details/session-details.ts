import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from '../../core/services/interview';
import { SessionDetailsDto } from '../../shared/models/interview.model';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-session-details',
  imports: [
    CardModule,
    AccordionModule,
    ButtonModule,
    TagModule,
    DatePipe,
    SlicePipe
  ],
  templateUrl: './session-details.html',
  styleUrl: './session-details.css'
})
export class SessionDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly interviewService = inject(InterviewService);
  private readonly messageService = inject(MessageService);

  sessionDetails = signal<SessionDetailsDto | null>(null);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (sessionId) {
      this.loadSessionDetails(sessionId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Session ID not found'
      });
      this.router.navigate(['/dashboard']);
    }
  }

  loadSessionDetails(sessionId: string): void {
    this.loading.set(true);
    this.interviewService.getSessionDetails(sessionId).subscribe({
      next: (details) => {
        this.sessionDetails.set(details);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching session details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load session details'
        });
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    return status === 'COMPLETED' ? 'success' : 'info';
  }
}

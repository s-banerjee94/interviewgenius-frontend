import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MarkdownModule } from 'ngx-markdown';
import { QuestionDto } from '../../shared/models/interview.model';
import { InterviewService } from '../../core/services/interview';
import { Auth } from '../../core/services/auth';

interface Question {
  id: number;
  text: string;
}

@Component({
  selector: 'app-interview',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    MarkdownModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './interview.html',
  styleUrl: './interview.css'
})
export class Interview implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly interviewService = inject(InterviewService);
  private readonly authService = inject(Auth);


  // Session info
  sessionId = signal<string | null>(null);

  // Audio recording
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordedBlob = signal<Blob | null>(null);

  // Timer state
  private timerInterval: any = null;
  timerSeconds = signal<number>(0);
  formattedTime = computed(() => {
    const seconds = this.timerSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  // Interview state
  isStarted = signal<boolean>(false);
  isRecording = signal<boolean>(false);
  hasRecording = signal<boolean>(false);
  currentQuestionIndex = signal<number>(0);
  isSubmitting = signal<boolean>(false);
  isLoadingFirstQuestion = signal<boolean>(false);

  // Questions loaded from backend
  questions: Question[] = [
    {
      id: 1,
      text: '' // Will be replaced by first question from backend
    }
  ];

  currentQuestion = computed(() => {
    const index = this.currentQuestionIndex();
    return this.questions[index] || null;
  });

  questionNumber = computed(() => this.currentQuestionIndex() + 1);

  ngOnInit() {
    // Get session ID from route
    const sessionIdParam = this.route.snapshot.paramMap.get('sessionId');
    if (!sessionIdParam) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Session ID is required'
      });
      this.router.navigate(['/dashboard']);
      return;
    }

    this.sessionId.set(sessionIdParam);

    // Load first question from backend
    this.loadFirstQuestion(sessionIdParam);
  }

  private loadFirstQuestion(sessionId: string) {
    this.isLoadingFirstQuestion.set(true);

    this.interviewService.getFirstQuestion(sessionId).subscribe({
      next: (response) => {
        this.isLoadingFirstQuestion.set(false);

        if (response && response.question) {
          // Replace the first mock question with the real one from backend
          this.questions[0] = {
            id: 1,
            text: response.question
          };
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No question received from server'
          });
        }
      },
      error: (error) => {
        this.isLoadingFirstQuestion.set(false);
        console.error('Error loading first question:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load interview question'
        });
      }
    });
  }

  // Check if first question is loaded successfully
  get canStartInterview(): boolean {
    return !this.isLoadingFirstQuestion() && this.questions[0]?.text !== '';
  }

  startInterview() {
    this.isStarted.set(true);
    this.startTimer();
    this.messageService.add({
      severity: 'success',
      summary: 'Interview Started',
      detail: 'Good luck with your interview!'
    });
  }

  endInterview() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to end this interview? This action cannot be undone.',
      header: 'End Interview',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, End Interview',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const sessionIdValue = this.sessionId();

        if (!sessionIdValue) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Session ID not found'
          });
          return;
        }

        // Call backend to end session with force=true
        this.interviewService.endSession(sessionIdValue, true).subscribe({
          next: () => {
            this.completeInterview();
          },
          error: (error) => {
            console.error('Error ending interview:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to end interview. Please try again.'
            });
          }
        });
      }
    });
  }

  private completeInterview() {
    this.stopTimer();
    this.messageService.add({
      severity: 'info',
      summary: 'Interview Ended',
      detail: 'Redirecting to dashboard...'
    });

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }

  async recordAnswer() {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize MediaRecorder
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.recordedBlob.set(audioBlob);
        this.hasRecording.set(true);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        this.messageService.add({
          severity: 'success',
          summary: 'Recording Stopped',
          detail: 'Your answer has been recorded'
        });
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording.set(true);

      this.messageService.add({
        severity: 'info',
        summary: 'Recording',
        detail: 'Recording your answer...'
      });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Recording Error',
        detail: 'Could not access microphone. Please check permissions.'
      });
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  reRecord() {
    this.hasRecording.set(false);
    this.recordedBlob.set(null);
    this.audioChunks = [];
    this.messageService.add({
      severity: 'info',
      summary: 'Ready to Re-record',
      detail: 'Click "Record Answer" to try again'
    });
  }

  submitAnswer() {
    if (!this.hasRecording()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Recording',
        detail: 'Please record an answer before submitting'
      });
      return;
    }

    const blob = this.recordedBlob();
    const sessionIdValue = this.sessionId();

    if (!blob || !sessionIdValue) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing recording or session information'
      });
      return;
    }

    // Get user info
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated'
      });
      return;
    }

    const userName = `${user.firstName} ${user.lastName}`.trim() || user.email;

    // Convert blob to file
    const file = new File([blob], 'answer.webm', { type: 'audio/webm' });

    this.isSubmitting.set(true);

    // Submit answer to backend
    this.interviewService.submitAnswer(sessionIdValue, file, user.id.toString(), userName).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);

        this.messageService.add({
          severity: 'success',
          summary: 'Answer Submitted',
          detail: 'Your answer has been recorded successfully'
        });

        // Check if interview is complete
        if (response.sessionStatus === 'COMPLETED' || !response.nextQuestion) {
          this.messageService.add({
            severity: 'success',
            summary: 'Interview Complete',
            detail: 'You have answered all questions!'
          });
          setTimeout(() => {
            this.completeInterview();
          }, 3000);
        } else {
          // Move to next question
          const nextIndex = this.currentQuestionIndex() + 1;
          this.currentQuestionIndex.set(nextIndex);

          // Update questions array with next question
          if (nextIndex < this.questions.length) {
            this.questions[nextIndex] = {
              id: nextIndex + 1,
              text: response.nextQuestion
            };
          } else {
            // Add new question if we're beyond the mock questions
            this.questions.push({
              id: nextIndex + 1,
              text: response.nextQuestion
            });
          }

          // Reset recording state for next question
          this.hasRecording.set(false);
          this.recordedBlob.set(null);
          this.audioChunks = [];
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        console.error('Error submitting answer:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: 'Could not submit your answer. Please try again.'
        });
      }
    });
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.timerSeconds.update(s => s + 1);
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}

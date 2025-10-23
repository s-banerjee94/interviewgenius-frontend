import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { InterviewService } from '../../core/services/interview';
import { CreateInterviewSessionRequest } from '../../shared/models/interview.model';

@Component({
  selector: 'app-interview-setup',
  imports: [
    CommonModule,
    StepperModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    DividerModule
  ],
  templateUrl: './interview-setup.html',
  styleUrl: './interview-setup.css'
})
export class InterviewSetup implements OnInit, OnDestroy {
  // Interview Rules
  interviewRules = [
    {
      icon: 'pi-microphone',
      title: 'Enable Your Microphone',
      description: 'Make sure your microphone is working properly for voice responses'
    },
    {
      icon: 'pi-video',
      title: 'Enable Your Camera',
      description: 'Camera access is required for video monitoring during the interview'
    },
    {
      icon: 'pi-desktop',
      title: 'Stable Internet Connection',
      description: 'Ensure you have a stable internet connection throughout the interview'
    },
    {
      icon: 'pi-volume-up',
      title: 'Quiet Environment',
      description: 'Find a quiet place to avoid background noise and distractions'
    },
    {
      icon: 'pi-lock',
      title: 'No External Help',
      description: 'Complete the interview independently without external assistance'
    },
    {
      icon: 'pi-clock',
      title: 'Time Management',
      description: 'Answer questions within the allocated time for each question'
    }
  ];

  // Stepper state
  currentStep = signal<number>(1);
  browserCheckStatus = signal<'pending' | 'checking' | 'passed' | 'failed'>('pending');
  videoCheckStatus = signal<'pending' | 'checking' | 'passed' | 'failed'>('pending');
  soundCheckStatus = signal<'pending' | 'checking' | 'passed' | 'failed'>('pending');

  // Sound level monitoring
  soundLevel = signal<number>(0);
  isSoundTestActive = signal<boolean>(false);

  // Media stream
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  // Sound threshold for passing
  private readonly SOUND_THRESHOLD = 80; // 40% volume threshold
  private readonly SUSTAINED_FRAMES = 20; // Require 10 consecutive frames above threshold
  private thresholdFrameCount = 0;

  // Services
  private readonly interviewService = inject(InterviewService);
  private readonly messageService = inject(MessageService);

  // Session configuration from dialog data
  private experienceLevel: string;
  private language: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.experienceLevel = this.config.data?.experienceLevel || '';
    this.language = this.config.data?.language || '';
  }

  ngOnInit() {
    // Auto-start browser check
    this.startBrowserCheck();
  }

  ngOnDestroy() {
    this.stopSoundTest();
  }

  // Browser Compatibility Check
  startBrowserCheck() {
    this.browserCheckStatus.set('checking');

    // Simulate checking process
    setTimeout(() => {
      this.browserCheckStatus.set('passed');
    }, 1500);
  }

  // Video Testing
  startVideoTest() {
    this.videoCheckStatus.set('checking');

    // Simulate video test process (auto-pass)
    setTimeout(() => {
      this.videoCheckStatus.set('passed');
    }, 2000);
  }

  // Sound Testing
  async startSoundTest() {
    this.soundCheckStatus.set('checking');
    this.isSoundTestActive.set(true);
    this.thresholdFrameCount = 0; // Reset threshold counter
    this.soundLevel.set(0); // Reset sound level

    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create audio context and analyser
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      // Start monitoring sound level (threshold-based passing)
      this.monitorSoundLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      this.soundCheckStatus.set('failed');
      this.isSoundTestActive.set(false);
    }
  }

  stopSoundTest() {
    this.isSoundTestActive.set(false);

    // Stop animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    this.analyser = null;
    this.thresholdFrameCount = 0; // Reset threshold counter
  }

  private monitorSoundLevel() {
    if (!this.analyser || !this.isSoundTestActive()) {
      return;
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const updateLevel = () => {
      if (!this.analyser || !this.isSoundTestActive()) {
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const normalizedLevel = Math.min(100, (average / 128) * 100);
      const roundedLevel = Math.round(normalizedLevel);

      this.soundLevel.set(roundedLevel);

      // Check if threshold is reached
      if (roundedLevel >= this.SOUND_THRESHOLD) {
        this.thresholdFrameCount++;

        // Pass test after sustained threshold
        if (this.thresholdFrameCount >= this.SUSTAINED_FRAMES) {
          this.soundCheckStatus.set('passed');
          this.stopSoundTest();
          return; // Stop monitoring
        }
      } else {
        // Reset counter if level drops below threshold
        this.thresholdFrameCount = 0;
      }

      this.animationFrameId = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }

  // Calculate bar height for equalizer display
  getBarHeight(barIndex: number): number {
    const level = this.soundLevel();
    const barThreshold = (barIndex + 1) * 10;
    if (level >= barThreshold) return 100;
    if (level >= barThreshold - 10) return (level - (barThreshold - 10)) * 10;
    return 0;
  }

  // Complete setup and start interview
  startInterview() {
    this.stopSoundTest();

    // Create interview session
    const sessionRequest: CreateInterviewSessionRequest = {
      experienceLevel: this.experienceLevel,
      language: this.language
    };

    this.interviewService.createSession(sessionRequest).subscribe({
      next: (response) => {
        // Store session data in the service
        this.interviewService.setCurrentSession({
          sessionId: response.id,
          userId: response.userId,
          experienceLevel: response.experienceLevel,
          language: response.language,
          status: response.status,
          createdAt: response.createdAt
        });

        // Close dialog with success flag
        this.ref.close(true);
      },
      error: (err) => {
        console.error('Error creating interview session:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Session Creation Failed',
          detail: 'Failed to create interview session. Please try again.'
        });
        this.ref.close(false);
      }
    });
  }

  // Cancel setup
  cancelSetup() {
    this.stopSoundTest();
    this.ref.close(false);
  }
}

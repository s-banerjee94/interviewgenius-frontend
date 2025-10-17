import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { ProgressBar } from 'primeng/progressbar';
import { Divider } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { Auth } from '../../core/services/auth';
import { ResumeService } from '../../core/services/resume';
import { WorkExperience, Education, Skill } from '../../shared/models/resume.model';

@Component({
  selector: 'app-resume',
  imports: [
    FormsModule,
    Card,
    Button,
    InputText,
    Textarea,
    Checkbox,
    FileUploadModule,
    Dialog,
    Toast,
    ProgressBar,
    Divider
  ],
  templateUrl: './resume.html',
  styleUrl: './resume.css'
})
export class Resume implements OnInit {
  private authService = inject(Auth);
  private resumeService = inject(ResumeService);
  private messageService = inject(MessageService);

  // Loading states
  isLoading = signal(false);
  isUploading = signal(false);
  isParsing = signal(false);

  // User ID
  private userId: number | null = null;

  // Work Experience
  workExperiences = signal<WorkExperience[]>([]);
  showWorkExpDialog = signal(false);
  isEditingWorkExp = signal(false);
  currentWorkExpIndex = signal<number | null>(null);
  workExpForm: WorkExperience = {
    jobTitle: '',
    companyName: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentRole: false,
    description: ''
  };

  // Education
  educations = signal<Education[]>([]);
  showEducationDialog = signal(false);
  isEditingEducation = signal(false);
  currentEducationIndex = signal<number | null>(null);
  educationForm: Education = {
    degree: '',
    fieldOfStudy: '',
    institution: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    grade: '',
    description: ''
  };

  // Skills
  skills = signal<Skill[]>([]);
  showSkillDialog = signal(false);
  isEditingSkill = signal(false);
  currentSkillIndex = signal<number | null>(null);
  skillForm: Skill = {
    name: '',
    level: ''
  };

  // Resume file
  uploadedFile = signal<File | null>(null);
  resumeFileUrl = signal<string | null>(null);

  // Computed signals
  hasWorkExperiences = computed(() => this.workExperiences().length > 0);
  hasEducations = computed(() => this.educations().length > 0);
  hasSkills = computed(() => this.skills().length > 0);

  ngOnInit() {
    this.loadUserIdAndResume();
  }

  loadUserIdAndResume() {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.userId = user.id;
      // Load resume data from backend
      this.loadResumeFromBackend();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated'
      });
    }
  }

  loadResumeFromBackend() {
    if (!this.userId) return;

    this.isLoading.set(true);
    this.resumeService.getResume(this.userId).subscribe({
      next: (resume) => {
        this.workExperiences.set(resume.workExperiences || []);
        this.educations.set(resume.educations || []);
        this.skills.set(resume.skills || []);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.isLoading.set(false);
      }
    });
  }

  // Work Experience Methods
  openAddWorkExpDialog() {
    this.isEditingWorkExp.set(false);
    this.currentWorkExpIndex.set(null);
    this.workExpForm = {
      jobTitle: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      description: ''
    };
    this.showWorkExpDialog.set(true);
  }

  openEditWorkExpDialog(exp: WorkExperience, index: number) {
    this.isEditingWorkExp.set(true);
    this.currentWorkExpIndex.set(index);
    this.workExpForm = { ...exp };
    this.showWorkExpDialog.set(true);
  }

  saveWorkExperience() {
    const formData = this.workExpForm;

    // Validation
    if (!formData.jobTitle || !formData.companyName || !formData.startDate || !formData.description) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    if (this.isEditingWorkExp() && this.currentWorkExpIndex() !== null) {
      // Update existing
      const experiences = this.workExperiences();
      const index = this.currentWorkExpIndex()!;
      experiences[index] = { ...formData };
      this.workExperiences.set([...experiences]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Work experience updated successfully'
      });
    } else {
      // Create new
      const newExperience: WorkExperience = { ...formData };
      this.workExperiences.set([newExperience, ...this.workExperiences()]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Work experience added successfully'
      });
    }

    this.showWorkExpDialog.set(false);
  }

  deleteWorkExperience(index: number) {
    if (!confirm('Are you sure you want to delete this work experience?')) {
      return;
    }

    const experiences = this.workExperiences();
    experiences.splice(index, 1);
    this.workExperiences.set([...experiences]);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Work experience deleted successfully'
    });
  }

  // Education Methods
  openAddEducationDialog() {
    this.isEditingEducation.set(false);
    this.currentEducationIndex.set(null);
    this.educationForm = {
      degree: '',
      fieldOfStudy: '',
      institution: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      grade: '',
      description: ''
    };
    this.showEducationDialog.set(true);
  }

  openEditEducationDialog(edu: Education, index: number) {
    this.isEditingEducation.set(true);
    this.currentEducationIndex.set(index);
    this.educationForm = { ...edu };
    this.showEducationDialog.set(true);
  }

  saveEducation() {
    const formData = this.educationForm;

    // Validation
    if (!formData.degree || !formData.fieldOfStudy || !formData.institution || !formData.startDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    if (this.isEditingEducation() && this.currentEducationIndex() !== null) {
      // Update existing
      const educations = this.educations();
      const index = this.currentEducationIndex()!;
      educations[index] = { ...formData };
      this.educations.set([...educations]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Education updated successfully'
      });
    } else {
      // Create new
      const newEducation: Education = { ...formData };
      this.educations.set([newEducation, ...this.educations()]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Education added successfully'
      });
    }

    this.showEducationDialog.set(false);
  }

  deleteEducation(index: number) {
    if (!confirm('Are you sure you want to delete this education?')) {
      return;
    }

    const educations = this.educations();
    educations.splice(index, 1);
    this.educations.set([...educations]);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Education deleted successfully'
    });
  }

  // Skills Methods
  openAddSkillDialog() {
    this.isEditingSkill.set(false);
    this.currentSkillIndex.set(null);
    this.skillForm = {
      name: '',
      level: ''
    };
    this.showSkillDialog.set(true);
  }

  openEditSkillDialog(skill: Skill, index: number) {
    this.isEditingSkill.set(true);
    this.currentSkillIndex.set(index);
    this.skillForm = { ...skill };
    this.showSkillDialog.set(true);
  }

  saveSkill() {
    const formData = this.skillForm;

    // Validation
    if (!formData.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please enter a skill name'
      });
      return;
    }

    if (this.isEditingSkill() && this.currentSkillIndex() !== null) {
      // Update existing
      const skills = this.skills();
      const index = this.currentSkillIndex()!;
      skills[index] = { ...formData };
      this.skills.set([...skills]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Skill updated successfully'
      });
    } else {
      // Create new
      const newSkill: Skill = { ...formData };
      this.skills.set([...this.skills(), newSkill]);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Skill added successfully'
      });
    }

    this.showSkillDialog.set(false);
  }

  deleteSkill(index: number) {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    const skills = this.skills();
    skills.splice(index, 1);
    this.skills.set([...skills]);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Skill deleted successfully'
    });
  }

  // File Upload Methods
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.uploadedFile.set(event.files[0]);
      this.uploadResume(event.files[0]);
    }
  }

  uploadResume(file: File) {
    this.isUploading.set(true);

    this.resumeService.uploadResumePdf(file, this.userId!).subscribe({
      next: (response: any) => {
        console.log('Upload response:', response);

        const fileUrl = response.fileUrl || response.resumeFileUrl;
        if (fileUrl) {
          this.resumeFileUrl.set(fileUrl);
        }

        // Set work experiences and educations directly from response
        const workExperiences = response.workExperiences || [];
        const educations = response.educations || [];
        const skills = response.skills || [];

        this.workExperiences.set(workExperiences);
        this.educations.set(educations);
        this.skills.set(skills);

        this.isUploading.set(false);

        const parsedCount = workExperiences.length + educations.length;

        this.messageService.add({
          severity: 'success',
          summary: 'Upload Successful',
          detail: parsedCount > 0
            ? `Resume uploaded! Found ${workExperiences.length} work experience(s) and ${educations.length} education(s).`
            : 'Resume uploaded successfully!'
        });
      },
      error: (error) => {
        console.error('Error uploading resume:', error);
        this.isUploading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: error.error?.message || 'Failed to upload resume. Please try again.'
        });
      }
    });
  }

  saveResume() {
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated'
      });
      return;
    }



    this.isLoading.set(true);

    const resumeData = {
      workExperiences: this.workExperiences(),
      educations: this.educations(),
      resumeFileUrl: this.resumeFileUrl() || undefined
    };

    this.resumeService.saveResume(this.userId, resumeData).subscribe({
      next: (resume) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Resume saved successfully!'
        });
        // Update local data with server response
        this.workExperiences.set(resume.workExperiences || []);
        this.educations.set(resume.educations || []);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error saving resume:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save resume. Please try again.'
        });
      }
    });
  }

  // Format date for display
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  // Update form when checkbox changes
  onCurrentRoleChange(event: any) {
    if (this.workExpForm.isCurrentRole) {
      this.workExpForm.endDate = '';
    }
  }

  onCurrentlyStudyingChange(event: any) {
    if (this.educationForm.isCurrentlyStudying) {
      this.educationForm.endDate = '';
    }
  }
}

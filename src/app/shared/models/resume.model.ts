// Skills
export interface Skill {
  name: string;
  level?: string; // Beginner, Intermediate, Advanced, Expert
}

// Work Experience
export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string; // ISO format YYYY-MM
  endDate?: string; // ISO format YYYY-MM or null if current
  isCurrentRole: boolean;
  description: string;
}

// Education
export interface Education {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: string; // ISO format YYYY-MM or YYYY
  endDate?: string; // ISO format YYYY-MM or YYYY or null if current
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
}

// Resume
export interface Resume {
  userId: number;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  createdAt?: string;
  updatedAt?: string;
}

// API Request/Response interfaces
export interface CreateWorkExperienceRequest {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description: string;
}

export interface UpdateWorkExperienceRequest {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrentRole?: boolean;
  description?: string;
}

export interface CreateEducationRequest {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
}

export interface UpdateEducationRequest {
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  grade?: string;
  description?: string;
}

export interface CreateResumeRequest {
  workExperiences: WorkExperience[];
  educations: Education[];
  resumeFileUrl?: string;
}

export interface UpdateResumeRequest {
  workExperiences?: WorkExperience[];
  educations?: Education[];
  resumeFileUrl?: string;
}

export interface ResumeUploadResponse {
  fileUrl: string;
  parsedData?: {
    workExperiences: WorkExperience[];
    educations: Education[];
  };
}

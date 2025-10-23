export type InterviewStatus = 'ACTIVE' | 'COMPLETED';

export interface InterviewSession {
  sessionId: string;
  userId: string;
  experienceLevel: string;
  language: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInterviewSessionRequest {
  experienceLevel: string;
  language: string;
}

export interface CreateInterviewSessionResponse {
  id: string;
  userId: string;
  experienceLevel: string;
  language: string;
  status: InterviewStatus;
  createdAt: string;
}

export interface QuestionDto {
  question: string;
}

export interface FeedbackDto {
  feedback: string;
  score: number;
}

export interface AnswerSubmissionResponseDto {
  questionIndex: number;
  question: string;
  answer: string;
  totalQuestionsAnswered: number;
  sessionStatus: string;
  feedback: FeedbackDto;
  nextQuestion?: string;
}

export interface SessionListDto {
  sessionId: string;
  language: string;
  startTime: string;
  experienceLevel: string;
}

export interface QuestionAnswerDto {
  questionIndex: number;
  question: string;
  answer: string;
  audioFileUrl: string;
  questionTimestamp: string;
  answerTimestamp: string;
  feedback: string;
  score: number;
}

export interface SessionDetailsDto {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: InterviewStatus;
  questionAnswers: QuestionAnswerDto[];
}

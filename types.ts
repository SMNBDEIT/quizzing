export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  timeLimitSeconds: number;
  points: number; // Max points for this question
  explanation?: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface User {
  id: string;
  name: string;
  username: string; // Username might be derived or prompted if not provided by social auth
  email: string;
  password?: string; // Optional for social logins
  authProvider?: 'email' | 'google' | 'facebook'; // To track origin
}

export enum GameState {
  LOGIN,
  REGISTRATION,
  LOBBY,
  QUIZ_CREATION,
  QUESTION_TRANSITION,
  QUESTION_DISPLAY,
  ANSWER_FEEDBACK,
  RESULTS,
}
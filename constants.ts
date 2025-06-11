import { QuizData } from './types';

export const APP_TITLE = "Quizzing";
export const DEFAULT_QUESTION_DURATION_SECONDS = 20;
export const POINTS_PER_CORRECT_ANSWER_BASE = 1000; // Points are scaled by time remaining
export const QUESTION_TRANSITION_DELAY_MS = 2500; // For "Get Ready" screen
export const FEEDBACK_DISPLAY_DELAY_MS = 3500; // How long to show feedback before auto-advancing

export const MAX_QUESTIONS_PER_QUIZ = 10;
export const MIN_OPTIONS_PER_QUESTION = 2;
export const MAX_OPTIONS_PER_QUESTION = 4; // Typically 4 options

export const OPTION_COLORS = [
  'bg-red-600 hover:bg-red-500',    // Triangle
  'bg-blue-600 hover:bg-blue-500',   // Diamond
  'bg-yellow-500 hover:bg-yellow-400 text-slate-900', // Circle (yellow needs dark text)
  'bg-green-600 hover:bg-green-500', // Square
];

export const sampleQuiz: QuizData = {
  title: "General Knowledge Challenge",
  questions: [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: [
        { id: "q1_a1", text: "Berlin", isCorrect: false },
        { id: "q1_a2", text: "Madrid", isCorrect: false },
        { id: "q1_a3", text: "Paris", isCorrect: true },
        { id: "q1_a4", text: "Rome", isCorrect: false },
      ],
      timeLimitSeconds: 15,
      points: 1000,
      explanation: "Paris is the capital and most populous city of France. It is known for its art, fashion, gastronomy and culture."
    },
    {
      id: "q2",
      text: "Which HTML tag is used to define an internal style sheet?",
      options: [
        { id: "q2_a1", text: "<script>", isCorrect: false },
        { id: "q2_a2", text: "<css>", isCorrect: false },
        { id: "q2_a3", text: "<style>", isCorrect: true },
        { id: "q2_a4", text: "<link>", isCorrect: false },
      ],
      timeLimitSeconds: 20,
      points: 1000,
      explanation: "The <style> tag is used to define style information (CSS) for an HTML document."
    },
    {
      id: "q3",
      text: "What is 2 + 2 * 2?",
      options: [
        { id: "q3_a1", text: "8", isCorrect: false },
        { id: "q3_a2", text: "6", isCorrect: true },
        { id: "q3_a3", text: "4", isCorrect: false },
        { id: "q3_a4", text: "2", isCorrect: false },
      ],
      timeLimitSeconds: 10,
      points: 1000,
      explanation: "According to the order of operations (PEMDAS/BODMAS), multiplication comes before addition. So, 2 * 2 = 4, and then 2 + 4 = 6."
    },
    {
      id: "q4",
      text: "Which of these is a popular version control system?",
      options: [
        { id: "q4_a1", text: "Node.js", isCorrect: false },
        { id: "q4_a2", text: "jQuery", isCorrect: false },
        { id: "q4_a3", text: "Docker", isCorrect: false },
        { id: "q4_a4", text: "Git", isCorrect: true },
      ],
      timeLimitSeconds: 15,
      points: 1000,
      explanation: "Git is a widely-used distributed version control system for tracking changes in source code during software development."
    }
  ],
};
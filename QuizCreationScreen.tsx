import React, { useState, useCallback, ChangeEvent } from 'react';
import { QuizData, Question, AnswerOption } from '../types';
import { 
  APP_TITLE, 
  DEFAULT_QUESTION_DURATION_SECONDS, 
  POINTS_PER_CORRECT_ANSWER_BASE,
  MAX_QUESTIONS_PER_QUIZ,
  MAX_OPTIONS_PER_QUESTION,
  MIN_OPTIONS_PER_QUESTION
} from '../constants';

interface QuizCreationScreenProps {
  onQuizCreated: (quiz: QuizData) => void;
  onBackToLobby: () => void;
}

const createNewOption = (questionId: string, optionIndex: number): AnswerOption => ({
  id: `${questionId}_opt${optionIndex}`,
  text: '',
  isCorrect: false,
});

const createNewQuestion = (index: number): Question => {
  const questionId = `q_new_${Date.now()}_${index}`;
  return {
    id: questionId,
    text: '',
    options: Array.from({ length: MAX_OPTIONS_PER_QUESTION }, (_, i) => createNewOption(questionId, i)),
    timeLimitSeconds: DEFAULT_QUESTION_DURATION_SECONDS,
    points: POINTS_PER_CORRECT_ANSWER_BASE,
    explanation: '',
  };
};

const QuizCreationScreen: React.FC<QuizCreationScreenProps> = ({ onQuizCreated, onBackToLobby }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([createNewQuestion(0)]);
  const [currentQuestionEditIndex, setCurrentQuestionEditIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentQ = questions[currentQuestionEditIndex];

  const handleQuizTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(e.target.value);
    setError(null); 
  };

  const updateQuestionField = (field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionEditIndex] = {
      ...updatedQuestions[currentQuestionEditIndex],
      [field]: value,
    };
    setQuestions(updatedQuestions);
    setError(null); 
  };

  const handleQuestionTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionField('text', e.target.value);
  };

  const handleOptionTextChange = (optionIndex: number, text: string) => {
    const updatedOptions = [...currentQ.options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], text };
    updateQuestionField('options', updatedOptions);
  };

  const handleCorrectOptionChange = (optionIndex: number) => {
    const updatedOptions = currentQ.options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optionIndex,
    }));
    updateQuestionField('options', updatedOptions);
  };
  
  const handleTimeLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    updateQuestionField('timeLimitSeconds', Math.max(5, val || DEFAULT_QUESTION_DURATION_SECONDS)); // Min 5 seconds
  };

  const handlePointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    updateQuestionField('points', Math.max(100, val || POINTS_PER_CORRECT_ANSWER_BASE)); // Min 100 points
  };

  const handleExplanationChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateQuestionField('explanation', e.target.value);
  };

  const addQuestion = () => {
    if (questions.length < MAX_QUESTIONS_PER_QUIZ) {
      const newQ = createNewQuestion(questions.length);
      setQuestions([...questions, newQ]);
      setCurrentQuestionEditIndex(questions.length);
      setError(null); 
    } else {
      setError(`You can add a maximum of ${MAX_QUESTIONS_PER_QUIZ} questions.`);
    }
  };

  const removeCurrentQuestion = () => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, idx) => idx !== currentQuestionEditIndex);
      setQuestions(updatedQuestions);
      setCurrentQuestionEditIndex(Math.max(0, currentQuestionEditIndex - 1));
      setError(null); 
    } else {
      setError("You must have at least one question.");
    }
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestionEditIndex > 0) {
      setCurrentQuestionEditIndex(currentQuestionEditIndex - 1);
    } else if (direction === 'next' && currentQuestionEditIndex < questions.length - 1) {
      setCurrentQuestionEditIndex(currentQuestionEditIndex + 1);
    }
    setError(null); 
  };

  const validateQuiz = (): boolean => {
    if (!quizTitle.trim()) {
      setError("Quiz title is required.");
      return false;
    }
    if (questions.length === 0) {
        setError("Quiz must have at least one question.");
        return false;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1} text is required.`);
        setCurrentQuestionEditIndex(i);
        return false;
      }
      const filledOptions = q.options.filter(opt => opt.text.trim() !== '');
      if (filledOptions.length < MIN_OPTIONS_PER_QUESTION) {
        setError(`Question ${i + 1} must have at least ${MIN_OPTIONS_PER_QUESTION} options with text.`);
        setCurrentQuestionEditIndex(i);
        return false;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        setError(`Question ${i + 1} must have one correct answer selected.`);
        setCurrentQuestionEditIndex(i);
        return false;
      }
       if (q.timeLimitSeconds <= 0) {
        setError(`Question ${i+1} time limit must be greater than 0.`);
        setCurrentQuestionEditIndex(i);
        return false;
      }
      if (q.points <= 0) {
        setError(`Question ${i+1} points must be greater than 0.`);
        setCurrentQuestionEditIndex(i);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSaveQuiz = () => {
    if (validateQuiz()) {
      // Filter out empty options before saving
      const finalQuestions = questions.map(q => ({
        ...q,
        options: q.options.filter(opt => opt.text.trim() !== '')
      }));
      onQuizCreated({ title: quizTitle, questions: finalQuestions });
    }
  };
  
  if (!currentQ) { // Should not happen if questions array always has at least one item
    return <div className="text-red-500 p-4">Error: No question selected for editing. <button onClick={onBackToLobby}>Back</button></div>;
  }

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 p-4 md:p-6 flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-400">{APP_TITLE} - Create Quiz</h1>
        <button
          onClick={onBackToLobby}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg shadow transition-colors"
        >
          Back to Lobby
        </button>
      </header>

      <div className="mb-6">
        <label htmlFor="quizTitle" className="block text-lg font-semibold mb-2 text-slate-300">Quiz Title</label>
        <input
          type="text"
          id="quizTitle"
          value={quizTitle}
          onChange={handleQuizTitleChange}
          placeholder="Enter your awesome quiz title"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100"
        />
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-700 text-white rounded-lg shadow-md">{error}</div>}

      <div className="bg-slate-700 p-4 md:p-6 rounded-xl shadow-xl flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-200">
            Question {currentQuestionEditIndex + 1} / {questions.length} 
            <span className="text-sm text-slate-400"> (Max {MAX_QUESTIONS_PER_QUIZ})</span>
          </h2>
          <div className="space-x-2">
            <button onClick={() => navigateQuestion('prev')} disabled={currentQuestionEditIndex === 0} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 text-sm">Prev</button>
            <button onClick={() => navigateQuestion('next')} disabled={currentQuestionEditIndex === questions.length - 1} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 text-sm">Next</button>
            <button onClick={removeCurrentQuestion} disabled={questions.length <= 1} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 text-sm">Remove Q</button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor={`qtext-${currentQ.id}`} className="block text-sm font-medium text-slate-300 mb-1">Question Text</label>
            <textarea
              id={`qtext-${currentQ.id}`}
              value={currentQ.text}
              onChange={handleQuestionTextChange}
              rows={3}
              placeholder="What is the meaning of life?"
              className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-slate-300 mb-1">Answer Options (Select correct one)</legend>
            <div className="space-y-2">
            {currentQ.options.map((opt, index) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`q-${currentQ.id}-opt-correct-${opt.id}`}
                  name={`q-${currentQ.id}-correctOption`}
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectOptionChange(index)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-slate-500 bg-slate-600"
                />
                <input
                  type="text"
                  id={`q-${currentQ.id}-opt-text-${opt.id}`}
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            ))}
            </div>
          </fieldset>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`qtime-${currentQ.id}`} className="block text-sm font-medium text-slate-300 mb-1">Time Limit (seconds)</label>
              <input
                type="number"
                id={`qtime-${currentQ.id}`}
                value={currentQ.timeLimitSeconds}
                onChange={handleTimeLimitChange}
                min="5"
                className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor={`qpoints-${currentQ.id}`} className="block text-sm font-medium text-slate-300 mb-1">Points</label>
              <input
                type="number"
                id={`qpoints-${currentQ.id}`}
                value={currentQ.points}
                onChange={handlePointsChange}
                min="100"
                step="50"
                className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`qexp-${currentQ.id}`} className="block text-sm font-medium text-slate-300 mb-1">Explanation (Optional)</label>
            <textarea
              id={`qexp-${currentQ.id}`}
              value={currentQ.explanation || ''}
              onChange={handleExplanationChange}
              rows={2}
              placeholder="Why this answer is correct..."
              className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <button
          onClick={addQuestion}
          disabled={questions.length >= MAX_QUESTIONS_PER_QUIZ}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add New Question
        </button>
        <button
          onClick={handleSaveQuiz}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-xl transition-colors transform hover:scale-105"
        >
          Save & Start Quiz
        </button>
      </footer>
    </div>
  );
};

export default QuizCreationScreen;
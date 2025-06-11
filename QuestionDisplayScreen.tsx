
import React, { useState, useEffect } from 'react';
import { Question, AnswerOption as AnswerOptionType } from '../types';
import AnswerOptionButton from './AnswerOptionButton';
import TimerBar from './TimerBar';
import ProgressBar from './ProgressBar';

interface QuestionDisplayScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (optionId: string, timeLeftSeconds: number) => void;
  onTimeUp: () => void;
  score: number;
}

const QuestionDisplayScreen: React.FC<QuestionDisplayScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  onTimeUp,
  score,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentTime, setCurrentTime] = useState(question.timeLimitSeconds);

  const handleAnswerClick = (optionId: string) => {
    if (!isAnswered) {
      setIsAnswered(true);
      setSelectedOptionId(optionId);
      onAnswerSelect(optionId, currentTime);
    }
  };

  const handleTimeUp = () => {
    if (!isAnswered) { // Ensure onTimeUp is called only if no answer was selected
      setIsAnswered(true);
      onTimeUp();
    }
  };
  
  const handleTimerTick = (timeLeft: number) => {
    setCurrentTime(timeLeft);
  };

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentTime(question.timeLimitSeconds);
  }, [question]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 bg-slate-800 relative">
      <header className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2 text-sm md:text-base">
          <span>Question: {questionNumber}/{totalQuestions}</span>
          <span className="font-semibold">Score: {score}</span>
        </div>
        <ProgressBar current={questionNumber} total={totalQuestions} />
        <div className="mt-2 mb-4 md:mb-6">
          <TimerBar
            key={question.id} // Important: reset timer when question changes
            durationSeconds={question.timeLimitSeconds}
            onTimeUp={handleTimeUp}
            isPaused={isAnswered}
            resetKey={question.id}
            onTick={handleTimerTick}
          />
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col items-center justify-center">
        <div className="bg-slate-700 p-6 md:p-8 rounded-xl shadow-2xl w-full mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-center text-slate-100">
            {question.text}
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {question.options.map((option, index) => (
            <AnswerOptionButton
              key={option.id}
              option={option}
              index={index}
              onClick={() => handleAnswerClick(option.id)}
              disabled={isAnswered}
              isRevealed={false} // Revealing happens on feedback screen
              isSelected={selectedOptionId === option.id}
            />
          ))}
        </div>
      </main>
      
      <footer className="w-full text-center py-4 text-sm text-slate-500">
        Quizzing - Think Fast!
      </footer>
    </div>
  );
};

export default QuestionDisplayScreen;

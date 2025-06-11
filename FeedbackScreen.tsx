
import React, { useEffect } from 'react';
import { Question } from '../types';
import { CheckIcon, CrossIcon } from './icons';
import AnswerOptionButton from './AnswerOptionButton'; // Re-use for consistent display
import { FEEDBACK_DISPLAY_DELAY_MS } from '../constants';

interface FeedbackScreenProps {
  question: Question;
  selectedOptionId: string | null;
  isCorrect: boolean;
  pointsAwarded: number;
  onNextQuestion: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  question,
  selectedOptionId,
  isCorrect,
  pointsAwarded,
  onNextQuestion,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNextQuestion();
    }, FEEDBACK_DISPLAY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onNextQuestion]);

  const feedbackMessage = isCorrect ? "Correct!" : (selectedOptionId ? "Incorrect!" : "Time's Up!");
  const messageColor = isCorrect ? "text-green-400" : "text-red-400";
  const Icon = isCorrect ? CheckIcon : CrossIcon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-800 text-center">
      <div className={`mb-6 flex items-center justify-center p-4 rounded-full ${isCorrect ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
        <Icon className={`w-16 h-16 md:w-20 md:h-20 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
      </div>
      <h2 className={`text-4xl md:text-6xl font-bold mb-3 ${messageColor}`}>{feedbackMessage}</h2>
      {selectedOptionId && (
        <p className="text-xl md:text-2xl text-slate-300 mb-1">
          You earned <span className="font-bold text-yellow-400">{pointsAwarded}</span> points!
        </p>
      )}
      {!selectedOptionId && !isCorrect && (
         <p className="text-xl md:text-2xl text-slate-300 mb-1">No points this round.</p>
      )}


      <div className="my-8 p-6 bg-slate-700 rounded-lg shadow-xl w-full max-w-2xl">
        <p className="text-lg md:text-xl font-semibold text-slate-200 mb-4">The question was:</p>
        <p className="text-md md:text-lg text-slate-300 mb-6">{question.text}</p>
        
        <p className="text-lg md:text-xl font-semibold text-slate-200 mb-4">Answers:</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <AnswerOptionButton
              key={option.id}
              option={option}
              index={index}
              onClick={() => {}} // No action on click here
              disabled={true} // Always disabled on feedback
              isRevealed={true} // Always revealed
              isSelected={selectedOptionId === option.id}
            />
          ))}
        </div>
        {question.explanation && (
          <div className="mt-6 pt-4 border-t border-slate-600">
            <h4 className="text-md font-semibold text-purple-300 mb-2">Explanation:</h4>
            <p className="text-sm text-slate-400">{question.explanation}</p>
          </div>
        )}
      </div>

      <button
        onClick={onNextQuestion}
        className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default FeedbackScreen;

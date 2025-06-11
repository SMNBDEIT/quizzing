
import React, { useEffect } from 'react';
import { QUESTION_TRANSITION_DELAY_MS } from '../constants';

interface QuestionTransitionScreenProps {
  questionNumber: number;
  totalQuestions: number;
  onTransitionEnd: () => void;
}

const QuestionTransitionScreen: React.FC<QuestionTransitionScreenProps> = ({
  questionNumber,
  totalQuestions,
  onTransitionEnd,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTransitionEnd();
    }, QUESTION_TRANSITION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onTransitionEnd]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-800 text-center">
      <div className="animate-pulse">
        <p className="text-2xl md:text-3xl text-slate-400 mb-3">Get Ready for...</p>
        <h2 className="text-4xl md:text-6xl font-bold text-purple-400">
          Question {questionNumber}
          <span className="text-3xl md:text-5xl text-slate-500"> / {totalQuestions}</span>
        </h2>
      </div>
    </div>
  );
};

export default QuestionTransitionScreen;

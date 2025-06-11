
import React from 'react';
import { APP_TITLE } from '../constants';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  onPlayAgain,
}) => {
  const percentageCorrect = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  let message = "Good effort!";
  if (percentageCorrect > 90) message = "Excellent! You're a Quiz Master!";
  else if (percentageCorrect > 70) message = "Great job! Very knowledgeable!";
  else if (percentageCorrect > 50) message = "Well done! Solid performance!";


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-900 text-center">
      <img src={`https://picsum.photos/seed/quizresults${score}/120/120`} alt="Result Trophy" className="rounded-full shadow-2xl mb-6 w-28 h-28 md:w-32 md:h-32" />
      <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-3">Quiz Completed!</h2>
      <p className="text-xl md:text-2xl text-yellow-400 mb-8">{message}</p>

      <div className="bg-slate-800 bg-opacity-70 p-6 md:p-8 rounded-xl shadow-2xl mb-10 w-full max-w-md">
        <p className="text-2xl md:text-3xl text-slate-300 mb-2">Your Final Score:</p>
        <p className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-6">
          {score}
        </p>
        <div className="text-lg md:text-xl text-slate-300">
          <p>Correct Answers: <span className="font-semibold text-green-400">{correctAnswers}</span> / {totalQuestions}</p>
          <p>Accuracy: <span className="font-semibold text-blue-400">{percentageCorrect}%</span></p>
        </div>
      </div>

      <button
        onClick={onPlayAgain}
        className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-xl md:text-2xl font-bold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
      >
        Play Again
      </button>
      <p className="mt-10 text-sm text-slate-500">&copy; {new Date().getFullYear()} {APP_TITLE}</p>
    </div>
  );
};

export default ResultsScreen;

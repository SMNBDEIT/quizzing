import React from 'react';
import { APP_TITLE } from '../constants';
import { User } from '../types';

interface StartScreenProps {
  currentUser: User | null;
  onLogout: () => void;
  onStartSampleQuiz: () => void;
  onStartUserQuiz?: () => void;
  onCreateQuiz: () => void;
  sampleQuizTitle: string;
  userQuizTitle?: string;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  currentUser,
  onLogout,
  onStartSampleQuiz,
  onStartUserQuiz,
  onCreateQuiz,
  sampleQuizTitle,
  userQuizTitle,
  onGoToLogin,
  onGoToRegister,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-purple-900 text-center">
      <header className="absolute top-4 right-4 flex items-center space-x-3">
        {currentUser ? (
          <>
            <span className="text-slate-300 text-sm md:text-base">
              Hi, <span className="font-semibold text-purple-300">{currentUser.name || currentUser.username}!</span>
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md transition-colors"
            >
              Login
            </button>
            <button
              onClick={onGoToRegister}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md transition-colors"
            >
              Register
            </button>
          </>
        )}
      </header>

      <img src="https://picsum.photos/seed/quizzinglogo/150/150" alt="Quizzing Logo" className="rounded-full shadow-2xl mb-8 w-32 h-32 md:w-40 md:h-40" />
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-4">
        {APP_TITLE}
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 mb-10">
        {currentUser ? "Manage your quizzes or play a game!" : "Test your knowledge or log in to create!"}
      </p>

      <div className="space-y-5 flex flex-col items-center">
        {userQuizTitle && onStartUserQuiz && (
          <button
            onClick={onStartUserQuiz}
            className="w-72 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg md:text-xl font-bold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Play: {userQuizTitle}
          </button>
        )}
        <button
          onClick={onStartSampleQuiz}
          className="w-72 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg md:text-xl font-bold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
        >
          Play: {sampleQuizTitle}
        </button>
        {currentUser && (
          <button
            onClick={onCreateQuiz}
            className="w-72 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg md:text-xl font-bold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50"
          >
            Create Your Own Quiz
          </button>
        )}
      </div>
      <p className="mt-12 text-sm text-slate-500">Powered by Fun & Brainpower</p>
    </div>
  );
};

export default StartScreen;
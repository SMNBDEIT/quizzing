import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Question, QuizData, User } from './types';
import { sampleQuiz, APP_TITLE } from './constants';
import StartScreen from './components/StartScreen';
import QuestionTransitionScreen from './components/QuestionTransitionScreen';
import QuestionDisplayScreen from './components/QuestionDisplayScreen';
import FeedbackScreen from './components/FeedbackScreen';
import ResultsScreen from './components/ResultsScreen';
import QuizCreationScreen from './components/QuizCreationScreen';
import RegistrationScreen from './components/RegistrationScreen';
import LoginScreen from './components/LoginScreen';

const USERS_STORAGE_KEY = 'quizzing_users';
const CURRENT_USER_STORAGE_KEY = 'quizzing_currentUser';

console.warn(
  "SECURITY WARNING: This application uses localStorage for user data and authentication for demonstration purposes only. " +
  "Plain text passwords are being stored, which is highly insecure. Social login is SIMULATED and does not connect to actual providers. DO NOT use this approach in a production environment."
);


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [pointsForCurrentQuestion, setPointsForCurrentQuestion] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const [userQuiz, setUserQuiz] = useState<QuizData | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(sampleQuiz);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedCurrentUser) {
        const parsedUser = JSON.parse(storedCurrentUser) as User;
        const allUsers = storedUsers ? JSON.parse(storedUsers) as User[] : [];
        if (allUsers.find(u => u.id === parsedUser.id)) {
            setCurrentUser(parsedUser);
        } else {
            localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
    setGameState(GameState.LOBBY);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving currentUser to localStorage:", error);
    }
  }, [currentUser]);

  const currentQuestion: Question | undefined = activeQuiz.questions[currentQuestionIndex];

  const checkUserExists = useCallback((username: string, email: string): { usernameExists: boolean, emailExists: boolean } => {
    const usernameLower = username.toLowerCase();
    const emailLower = email.toLowerCase();
    const usernameExists = users.some(user => user.username.toLowerCase() === usernameLower);
    const emailExists = users.some(user => user.email.toLowerCase() === emailLower);
    return { usernameExists, emailExists };
  }, [users]);

  // For email/password login
  const findUserByCredentials = useCallback((identifier: string, passwordToCheck: string): User | null => {
    const identifierLower = identifier.toLowerCase();
    const user = users.find(
      u => (u.username.toLowerCase() === identifierLower || u.email.toLowerCase() === identifierLower) &&
           u.authProvider === 'email' && // Only allow email/password login for 'email' authProvider
           u.password === passwordToCheck 
    );
    return user || null;
  }, [users]);

  const handleRegisterSuccess = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]); // newUser already has authProvider: 'email'
    setCurrentUser(newUser);
    setGameState(GameState.LOBBY);
  }, []);
  
  const handleLoginSuccess = useCallback((user: User) => {
    setCurrentUser(user);
    setGameState(GameState.LOBBY);
  }, []);

  const handleSimulatedSocialLoginOrRegister = useCallback((provider: 'google' | 'facebook', email: string, name: string) => {
    const emailLower = email.toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === emailLower);

    if (user) {
      // User exists, log them in. Update authProvider if it was 'email' or different social.
      if (user.authProvider !== provider) {
        user = { ...user, authProvider: provider, name: user.name || name }; // Update name if current name is empty
        setUsers(prevUsers => prevUsers.map(u => u.id === user!.id ? user! : u));
      }
      setCurrentUser(user);
    } else {
      // New user via social
      const newSocialUser: User = {
        id: `user_${Date.now()}`,
        name: name || email.split('@')[0], // Use provided name or derive from email
        username: `${provider}_${email.split('@')[0]}_${Date.now().toString().slice(-4)}`, // Generate a unique username
        email: email,
        authProvider: provider,
        // No password for social logins
      };
      setUsers(prevUsers => [...prevUsers, newSocialUser]);
      setCurrentUser(newSocialUser);
    }
    setGameState(GameState.LOBBY);
    alert(`SIMULATION: Successfully logged in/registered with ${provider} using email: ${email}`);
  }, [users]);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setGameState(GameState.LOBBY);
  }, []);

  const handleGoToLogin = useCallback(() => setGameState(GameState.LOGIN), []);
  const handleGoToRegister = useCallback(() => setGameState(GameState.REGISTRATION), []);
  
  const resetToLobby = useCallback(() => {
    setGameState(GameState.LOBBY);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswerId(null);
  }, []);

  const resetGameForNewQuiz = useCallback((quizToPlay: QuizData) => {
    setActiveQuiz(quizToPlay);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswerId(null);
    setIsCurrentAnswerCorrect(false);
    setPointsForCurrentQuestion(0);
    setCorrectAnswersCount(0);
    setGameState(GameState.QUESTION_TRANSITION);
  }, []);
  
  const handleStartSampleQuiz = useCallback(() => {
    resetGameForNewQuiz(sampleQuiz);
  }, [resetGameForNewQuiz]);

  const handleStartUserQuiz = useCallback(() => {
    if (userQuiz) {
      resetGameForNewQuiz(userQuiz);
    } else {
      console.warn("Attempted to start user quiz, but no user quiz is loaded.");
      resetGameForNewQuiz(sampleQuiz); 
    }
  }, [userQuiz, resetGameForNewQuiz]);
  
  const handleCreateQuiz = useCallback(() => {
    if (currentUser) {
      setGameState(GameState.QUIZ_CREATION);
    } else {
        setGameState(GameState.LOGIN); 
    }
  }, [currentUser]);

  const handleQuizCreated = useCallback((newQuiz: QuizData) => {
    setUserQuiz(newQuiz); 
    resetGameForNewQuiz(newQuiz);
  }, [resetGameForNewQuiz]);

  const handleTransitionEnd = useCallback(() => {
    setGameState(GameState.QUESTION_DISPLAY);
  }, []);

  const handleAnswerSelect = useCallback((optionId: string, timeLeftSeconds: number) => {
    setSelectedAnswerId(optionId);
    if (currentQuestion) {
      const selectedOpt = currentQuestion.options.find(opt => opt.id === optionId);
      const correct = !!selectedOpt?.isCorrect;
      setIsCurrentAnswerCorrect(correct);
      
      let points = 0;
      if (correct) {
        const timeLimit = currentQuestion.timeLimitSeconds > 0 ? currentQuestion.timeLimitSeconds : 1;
        const validTimeLeft = Math.max(0, Math.min(timeLeftSeconds, currentQuestion.timeLimitSeconds));
        points = Math.round((validTimeLeft / timeLimit) * currentQuestion.points);
        setCorrectAnswersCount(prev => prev + 1);
      }
      setScore(prevScore => prevScore + points);
      setPointsForCurrentQuestion(points);
    }
    setGameState(GameState.ANSWER_FEEDBACK);
  }, [currentQuestion]);

  const handleTimeUp = useCallback(() => {
    setSelectedAnswerId(null); 
    setIsCurrentAnswerCorrect(false);
    setPointsForCurrentQuestion(0);
    setGameState(GameState.ANSWER_FEEDBACK);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswerId(null);
      setIsCurrentAnswerCorrect(false);
      setPointsForCurrentQuestion(0);
      setGameState(GameState.QUESTION_TRANSITION);
    } else {
      setGameState(GameState.RESULTS);
    }
  }, [currentQuestionIndex, activeQuiz.questions.length]);


  const renderScreen = () => {
    switch (gameState) {
      case GameState.LOGIN:
        return <LoginScreen 
                  onLoginSuccess={handleLoginSuccess} 
                  onGoToRegister={handleGoToRegister} 
                  findUser={findUserByCredentials} 
                  onSocialLogin={handleSimulatedSocialLoginOrRegister}
                />;
      case GameState.REGISTRATION:
        return <RegistrationScreen 
                  onRegisterSuccess={handleRegisterSuccess} 
                  onGoToLogin={handleGoToLogin} 
                  checkUserExists={checkUserExists}
                  onSocialRegister={handleSimulatedSocialLoginOrRegister}
                />;
      case GameState.LOBBY:
        return <StartScreen 
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onStartSampleQuiz={handleStartSampleQuiz} 
                  sampleQuizTitle={sampleQuiz.title}
                  onCreateQuiz={handleCreateQuiz} 
                  userQuizTitle={userQuiz?.title}
                  onStartUserQuiz={userQuiz ? handleStartUserQuiz : undefined}
                  onGoToLogin={handleGoToLogin}
                  onGoToRegister={handleGoToRegister}
                />;
      case GameState.QUIZ_CREATION:
        if (!currentUser) { 
            setGameState(GameState.LOGIN);
            return <LoginScreen 
                      onLoginSuccess={handleLoginSuccess} 
                      onGoToRegister={handleGoToRegister} 
                      findUser={findUserByCredentials} 
                      onSocialLogin={handleSimulatedSocialLoginOrRegister}
                    />;
        }
        return <QuizCreationScreen onQuizCreated={handleQuizCreated} onBackToLobby={resetToLobby} />;
      case GameState.QUESTION_TRANSITION:
        return (
          <QuestionTransitionScreen
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={activeQuiz.questions.length}
            onTransitionEnd={handleTransitionEnd}
          />
        );
      case GameState.QUESTION_DISPLAY:
        if (currentQuestion) {
             return (
                <QuestionDisplayScreen
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={activeQuiz.questions.length}
                    onAnswerSelect={handleAnswerSelect}
                    onTimeUp={handleTimeUp}
                    score={score}
                />
            );
        }
        console.error("Error: Question not found in QUESTION_DISPLAY state. Resetting to lobby.");
        resetToLobby();
        return null; 
      case GameState.ANSWER_FEEDBACK:
         if (currentQuestion) { 
            return (
                <FeedbackScreen
                    question={currentQuestion}
                    selectedOptionId={selectedAnswerId}
                    isCorrect={isCurrentAnswerCorrect}
                    pointsAwarded={pointsForCurrentQuestion}
                    onNextQuestion={handleNextQuestion}
                />
            );
        }
        console.error("Error: Question not found for feedback. Resetting to lobby.");
        resetToLobby();
        return null;
      case GameState.RESULTS:
        return (
          <ResultsScreen
            score={score}
            totalQuestions={activeQuiz.questions.length}
            correctAnswers={correctAnswersCount}
            onPlayAgain={() => resetGameForNewQuiz(activeQuiz)}
          />
        );
      default:
        console.warn(`Unexpected game state: ${gameState}. Resetting to LOBBY.`);
        setGameState(GameState.LOBBY); 
        return null;
    }
  };

  return <div className="App">{renderScreen()}</div>;
};

export default App;
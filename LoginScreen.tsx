import React, { useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onGoToRegister: () => void;
  findUser: (identifier: string, passwordToCheck: string) => User | null;
  onSocialLogin: (provider: 'google' | 'facebook', email: string, name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToRegister, findUser, onSocialLogin }) => {
  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError("Username/Email and Password are required.");
      return;
    }

    const user = findUser(identifier, password);

    if (user) {
      if (user.authProvider && user.authProvider !== 'email') {
        setError(`This account is linked with ${user.authProvider}. Please use the social login option or reset password (feature not implemented).`);
        return;
      }
      onLoginSuccess(user);
    } else {
      setError("Invalid credentials or user not found.");
    }
  };

  const handleSimulatedSocialLogin = (provider: 'google' | 'facebook') => {
    setError(null);
    const mockEmail = window.prompt(`SIMULATION: Enter ${provider} email:`);
    if (!mockEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mockEmail)) {
      alert("Invalid email format entered.");
      return;
    }
    const mockName = window.prompt(`SIMULATION: Enter ${provider} name (optional, press OK if none):`) || mockEmail.split('@')[0];
    
    // In a real app, you'd get this info from the provider
    // Then call a function to find or create user based on this info
    onSocialLogin(provider, mockEmail, mockName);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Welcome Back!</h2>
        
        <p className="text-xs text-yellow-300 bg-yellow-800 bg-opacity-50 p-2 rounded-md mb-4 text-center">
          <strong>Note:</strong> Social logins below are SIMULATED for demo purposes and do not connect to actual Google/Facebook.
        </p>

        {error && <p className="bg-red-700 text-white p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-slate-300 mb-1">Username or Email</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="your_username or you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Login with Email
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-slate-600"/>
          <span className="mx-4 text-slate-400 text-sm">OR</span>
          <hr className="flex-grow border-slate-600"/>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSimulatedSocialLogin('google')}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
            aria-label="Sign in with Google (Simulated)"
          >
            {/* Simple G icon simulation */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => handleSimulatedSocialLogin('facebook')}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
            aria-label="Sign in with Facebook (Simulated)"
          >
            {/* Simple F icon simulation */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.85z" /></svg>
            <span>Sign in with Facebook</span>
          </button>
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{' '}
          <button onClick={onGoToRegister} className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
            Register here
          </button>
        </p>
      </div>
       <p className="text-xs text-slate-500 mt-6 text-center max-w-md">
        Quizzing App. Remember: Passwords are not stored securely in this demo. Social login is simulated.
      </p>
    </div>
  );
};

export default LoginScreen;
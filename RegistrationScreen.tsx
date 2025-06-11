import React, { useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../types';

interface RegistrationScreenProps {
  onRegisterSuccess: (user: User) => void;
  onGoToLogin: () => void;
  checkUserExists: (username: string, email: string) => { usernameExists: boolean, emailExists: boolean };
  onSocialRegister: (provider: 'google' | 'facebook', email: string, name: string) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegisterSuccess, onGoToLogin, checkUserExists, onSocialRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { usernameExists, emailExists } = checkUserExists(username, email);
    if (usernameExists) {
      setError("Username already taken. Please choose another.");
      return;
    }
    if (emailExists) {
      setError("Email already registered. Please login or use another email.");
      return;
    }
    
    console.warn("SECURITY WARNING: Storing plain text password in localStorage. This is NOT secure for production applications.");

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      username,
      email,
      password, 
      authProvider: 'email',
    };
    onRegisterSuccess(newUser);
  };

  const handleSimulatedSocialSignup = (provider: 'google' | 'facebook') => {
    setError(null);
    const mockEmail = window.prompt(`SIMULATION: Enter ${provider} email to sign up:`);
    if (!mockEmail) return;
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mockEmail)) {
      alert("Invalid email format entered.");
      return;
    }
    const mockName = window.prompt(`SIMULATION: Enter ${provider} name (optional, press OK if none):`) || mockEmail.split('@')[0];
    
    onSocialRegister(provider, mockEmail, mockName);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Create Account</h2>

        <p className="text-xs text-yellow-300 bg-yellow-800 bg-opacity-50 p-2 rounded-md mb-4 text-center">
          <strong>Note:</strong> Social sign-ups below are SIMULATED for demo purposes and do not connect to actual Google/Facebook.
        </p>

        {error && <p className="bg-red-700 text-white p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="e.g., Ada Lovelace"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="e.g., ada_lovelace"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password (min. 8 characters)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="********"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-100 placeholder-slate-400"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Register with Email
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-slate-600"/>
          <span className="mx-4 text-slate-400 text-sm">OR</span>
          <hr className="flex-grow border-slate-600"/>
        </div>

        <div className="space-y-3">
           <button
            onClick={() => handleSimulatedSocialSignup('google')}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
            aria-label="Sign up with Google (Simulated)"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>
            <span>Sign up with Google</span>
          </button>
          <button
            onClick={() => handleSimulatedSocialSignup('facebook')}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
            aria-label="Sign up with Facebook (Simulated)"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.85z" /></svg>
            <span>Sign up with Facebook</span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
            Login here
          </button>
        </p>
      </div>
       <p className="text-xs text-slate-500 mt-6 text-center max-w-md">
        Note: For demonstration purposes, user data is stored in your browser's local storage. 
        Passwords are not securely hashed. Social sign-up is simulated.
      </p>
    </div>
  );
};

export default RegistrationScreen;
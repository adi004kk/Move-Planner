import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle,
  LogIn
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { user, login, logout, loginAsDemoUser, showToast } = useTravel();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('Alex Rivera');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (mode === 'signup') {
      login({ email: email.trim(), name: name.trim() || email.split('@')[0] });
      showToast('Account registered successfully! Welcome aboard.');
    } else {
      login({ email: email.trim(), name: name.trim() || email.split('@')[0] });
    }
    navigate('/profile');
  };

  const handleDemoSignIn = () => {
    loginAsDemoUser();
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setName('');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h1 className="font-serif text-2xl font-extrabold text-slate-900">
            {user.isLoggedIn
              ? 'Account Session'
              : mode === 'login'
              ? 'Welcome back to MovePlanner'
              : 'Create your MovePlanner Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {user.isLoggedIn
              ? `You are currently signed in as ${user.name}`
              : mode === 'login'
              ? 'Plan smarter, organize trips, and sync budgets across devices'
              : 'Join travelers discovering destinations and building custom itineraries'}
          </p>
        </div>

        {/* Already Logged In Banner */}
        {user.isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate block">
                      {user.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Logged In
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block truncate">
                    {user.email || 'Verified Traveler Account'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Home City</span>
                <span className="font-semibold text-slate-700">{user.homeCity || 'New Delhi, India'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => navigate('/profile')}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Go to Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Demo Fast Login Button */}
            <button
              onClick={handleDemoSignIn}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center gap-2 border border-sky-200 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>One-Click Demo Account Sign In</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                Or continue with email
              </span>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      placeholder="e.g. Alex Rivera"
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:border-sky-500 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:border-sky-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link sent to ' + (email || 'your email'), 'info')}
                      className="text-[11px] font-semibold text-sky-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800 focus:border-sky-500 focus:bg-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-sky-600 rounded-sm cursor-pointer"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{mode === 'login' ? 'Sign In to MovePlanner' : 'Create Free Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-2 text-xs text-slate-500">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>MovePlanner respects privacy. No third-party tracking.</span>
        </div>

      </div>
    </div>
  );
};

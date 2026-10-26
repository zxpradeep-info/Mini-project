import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        if (res.user?.role === 'COMPANY' || res.user?.role === 'ADMIN') {
          navigate('/company');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setError('');
    setSocialLoading(provider);
    try {
      let res;
      if (provider === 'google') {
        res = await loginWithGoogle();
      } else {
        res = await loginWithApple();
      }

      if (res?.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(`Failed to sign in with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') {
      setEmail('student@placement.edu');
      setPassword('password123');
    } else {
      setEmail('recruiter@abctech.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-100/60 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4 transform transition-transform hover:scale-105">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Student Skill & Placement Portal
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          College CSE Placement and Career Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your credentials to access your placement dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pradeep@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to your email.');
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/25 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                OR
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocial('google')}
              disabled={socialLoading !== null}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocial('apple')}
              disabled={socialLoading !== null}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.06-7.69-7.85-12-14.36-5.87-8.92-10.4-19.14-13.58-30.65-3.18-11.51-4.77-22.68-4.77-33.52 0-16.1 4.1-29.47 12.3-40.11 8.2-10.64 18.52-16.14 30.96-16.48 4.79 0 10.21 1.25 16.27 3.76 6.06 2.5 10.11 3.82 12.16 3.94 1.76-.12 6.05-1.52 12.87-4.2 6.82-2.68 12.24-3.88 16.27-3.62 13.9.72 24.8 5.72 32.7 15.01-12.06 7.34-17.95 17.4-17.67 30.18.28 9.93 4.11 18.21 11.5 24.84 5.26 4.78 11.36 7.82 18.3 9.12-2.19 6.74-4.8 13.62-7.84 20.65zM119.22 33.04c0-7.35 2.65-14.37 7.96-21.06 5.3-6.69 11.89-10.74 19.76-12.16.24 1.13.36 2.14.36 3.03 0 7.36-2.82 14.5-8.46 21.43-5.64 6.92-12.21 10.87-19.71 11.86-.06-1.02-.1-1.9-.1-2.65z" />
              </svg>
              <span>{socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-2">
              Quick One-Click Demo Credentials:
            </span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-2.5 py-1 text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg border border-blue-200 transition"
              >
                Fill Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('company')}
                className="px-2.5 py-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg border border-indigo-200 transition"
              >
                Fill Company Demo
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

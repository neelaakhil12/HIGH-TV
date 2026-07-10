'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert, LogIn, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery views state
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('high_tv_admin_session');
    if (session === 'authenticated') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('high_tv_admin_session', 'authenticated');
        localStorage.setItem('high_tv_admin_role', 'super-admin');
        localStorage.removeItem('high_tv_employee_info');
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid username or password. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    setRecoveryError('');
    setRecoveryMessage('');

    try {
      const response = await fetch('/api/superadmin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRecoveryMessage(data.message || 'Password reset link sent to your email.');
        setRecoveryEmail('');
      } else {
        setRecoveryError(data.error || 'Failed to send reset link. Please check the email.');
      }
    } catch (err) {
      console.error(err);
      setRecoveryError('An error occurred. Please try again later.');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top styling elements */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-[#02599c]" />
        
        {mode === 'login' ? (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 mb-2">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white telugu-text">హై టీవీ CMS</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Super Admin Control Center</p>
            </div>

            {error && (
              <div className="p-3 bg-red-955/40 border border-red-800/40 rounded-xl text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setRecoveryError('');
                      setRecoveryMessage('');
                    }}
                    className="text-xs text-rose-500 hover:text-rose-400 font-bold cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#02599c] hover:bg-[#024a82] disabled:bg-slate-800 text-white rounded-xl py-3 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/20 mb-2">
                <KeyRound className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white telugu-text">పాస్‌వర్డ్ రికవరీ</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Forgot Super Admin Password</p>
            </div>

            {recoveryError && (
              <div className="p-3 bg-red-955/40 border border-red-800/40 rounded-xl text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{recoveryError}</span>
              </div>
            )}

            {recoveryMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2">
                <span>✅</span>
                <span>{recoveryMessage}</span>
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Super Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="e.g. admin@hightv.in"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isRecovering}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white rounded-xl py-3 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{isRecovering ? 'Sending recovery mail...' : 'Send Password Reset Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setRecoveryError('');
                  setRecoveryMessage('');
                }}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white font-bold py-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </form>
          </>
        )}

        <div className="text-center text-[10px] text-slate-500 font-mono">
          High TV CMS v2.0 • Secured Authority Gate
        </div>
      </div>
    </div>
  );
}

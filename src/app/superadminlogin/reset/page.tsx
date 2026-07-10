'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, ShieldCheck, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Password reset token is missing from the link URL.');
      setIsValidating(false);
      return;
    }

    // Verify token validity
    fetch(`/api/superadmin/verify-token?token=${token}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsTokenValid(true);
        } else {
          setError(data.error || 'The reset link is invalid or has expired.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to verify reset token. Please request another reset link.');
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/superadmin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <svg className="animate-spin h-8 w-8 text-rose-600 mb-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Verifying secure token...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 py-4 text-center">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Password Reset Successful</h2>
          <p className="text-xs text-slate-400">Your super admin password has been updated in the database.</p>
        </div>
        <button
          onClick={() => router.push('/superadminlogin')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-black transition-all shadow-lg cursor-pointer"
        >
          Go to Sign In Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/20 mb-2">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white telugu-text">కొత్త పాస్‌వర్డ్</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reset Super Admin Password</p>
      </div>

      {error && (
        <div className="p-3 bg-red-955/40 border border-red-800/40 rounded-xl text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isTokenValid ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors text-white"
              />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors text-white"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#02599c] hover:bg-[#024a82] disabled:bg-slate-800 text-white rounded-xl py-3 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Resetting Password...' : 'Save New Password'}</span>
          </button>
        </form>
      ) : (
        <button
          onClick={() => router.push('/superadminlogin')}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 text-sm font-black transition-all shadow-lg cursor-pointer"
        >
          Back to Login Page
        </button>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top styling elements */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-[#02599c]" />
        
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <svg className="animate-spin h-8 w-8 text-rose-600 mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading UI Component...</span>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center text-[10px] text-slate-500 font-mono mt-6">
          High TV CMS v2.0 • Secured Authority Gate
        </div>
      </div>
    </div>
  );
}

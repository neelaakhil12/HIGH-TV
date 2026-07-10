'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert, LogIn, Eye, EyeOff } from 'lucide-react';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('high_tv_admin_session');
    if (session === 'authenticated') {
      router.push('/employee/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.employee) {
          localStorage.setItem('high_tv_admin_session', 'authenticated');
          localStorage.setItem('high_tv_admin_role', 'employee');
          localStorage.setItem('high_tv_employee_info', JSON.stringify(data.employee));
          router.push('/employee/admin');
          return;
        }
      }
      
      setError('Invalid email address or password. Please try again.');
    } catch (err) {
      console.error('Login error:', err);
      setError('Server communication failure. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top styling elements */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-[#02599c]" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-green-500/10 rounded-2xl text-green-500 border border-green-500/20 mb-2">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white telugu-text">హై టీవీ CMS</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reporter / Employee Login</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Email Address / Username</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-slate-950 border border-slate-800 focus:border-green-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-green-500 rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors text-white"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

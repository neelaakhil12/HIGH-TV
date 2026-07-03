'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert, LogIn } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // 1. Hardcoded credentials for super admin login
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('high_tv_admin_session', 'authenticated');
      localStorage.setItem('high_tv_admin_role', 'super-admin');
      localStorage.removeItem('high_tv_employee_info');
      router.push('/admin');
    } else {
      // 2. Dynamic employee login check via API
      try {
        const response = await fetch('/api/employees/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username, password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.employee) {
            localStorage.setItem('high_tv_admin_session', 'authenticated');
            localStorage.setItem('high_tv_admin_role', 'employee');
            localStorage.setItem('high_tv_employee_info', JSON.stringify(data.employee));
            router.push('/admin');
            return;
          }
        }
        
        setError('Invalid username or password. Please try again.');
      } catch (err) {
        console.error('Login error:', err);
        setError('Server communication failure. Please check your network.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top styling elements */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-[#02599c]" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white telugu-text">హై టీవీ CMS</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Super Admin Control Center</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#02599c] rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
              />
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

        <div className="text-center text-[10px] text-slate-500 font-mono">
          High TV CMS v2.0 • Secured Authority Gate
        </div>
      </div>
    </div>
  );
}

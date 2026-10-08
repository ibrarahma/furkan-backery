import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound, User } from 'lucide-react';
import { BakeryConfig } from '../config/bakeryConfig';

interface AdminLoginPageProps {
  config: BakeryConfig;
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export function AdminLoginPage({ config, onLoginSuccess, onBackToHome }: AdminLoginPageProps) {
  const [email, setEmail] = useState('admin@sweetcrumbs.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo authentication check
    if (
      (email.trim().toLowerCase() === 'admin@sweetcrumbs.com' ||
        email.trim().toLowerCase() === 'admin@example.com') &&
      password === 'admin123'
    ) {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Use demo credentials: admin@sweetcrumbs.com / admin123');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@sweetcrumbs.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-lg space-y-6">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#881337] mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bakery Store</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2A1E17]">
                Bakery Staff Portal
              </h1>
              <p className="text-xs text-stone-500">{config.businessName} Admin</p>
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Demo Authentication Mode</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            For demonstration and prototype testing, use the pre-filled credentials below.
            In production, attach Firebase Auth, Supabase, or your secure backend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sweetcrumbs.com"
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer"
          >
            Sign In to Dashboard
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Auto-Fill Demo Credentials (admin@sweetcrumbs.com / admin123)
          </button>
        </form>
      </div>
    </div>
  );
}

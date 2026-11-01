import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  User,
  AlertCircle,
  Loader2,
  Terminal,
  FileCode
} from 'lucide-react';
import { BakeryConfig } from '../config/bakeryConfig';
import { adminAuthService, AdminStatusResponse } from '../services/adminAuthService';

interface AdminLoginPageProps {
  config: BakeryConfig;
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export function AdminLoginPage({ config, onLoginSuccess, onBackToHome }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [authStatus, setAuthStatus] = useState<AdminStatusResponse>({ isConfigured: false });

  // Check server authentication configuration status
  useEffect(() => {
    let isMounted = true;
    async function checkServerAuth() {
      try {
        const status = await adminAuthService.checkStatus();
        if (isMounted) {
          setAuthStatus(status);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      }
    }
    checkServerAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authStatus.isConfigured) {
      setError(
        'Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await adminAuthService.login(email.trim(), password);
      if (response.success) {
        onLoginSuccess();
      } else {
        setError(response.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#881337]" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2A1E17]">
                Bakery Staff Portal
              </h1>
              <p className="text-xs text-stone-500">{config.businessName} · Secure Access</p>
            </div>
          </div>
        </div>

        {/* Loading status indicator */}
        {isCheckingStatus ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-stone-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#881337]" />
            <p>Verifying server security status...</p>
          </div>
        ) : !authStatus.isConfigured ? (
          /* Authentication Setup Required State (Requirement 8) */
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Admin Authentication Setup Required</span>
              </div>
              <p className="text-xs leading-relaxed text-rose-800 font-medium">
                Admin authentication setup is required. Please configure secure authentication before accessing the dashboard.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl text-xs space-y-3 text-stone-700">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#881337]" />
                <span>Bakery Owner Setup Instructions</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600">
                To protect customer privacy and bakery data, administrator access requires server-side authentication credentials.
              </p>
              
              <div className="space-y-2 pt-1">
                <p className="font-medium text-stone-800 text-[11px]">Option 1: Server Environment Variables (.env)</p>
                <div className="p-2.5 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] space-y-1">
                  <div>ADMIN_EMAIL=&quot;owner@sweetcrumbs.com&quot;</div>
                  <div>ADMIN_PASSWORD=&quot;YourSecurePasswordHere&quot;</div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="font-medium text-stone-800 text-[11px]">Option 2: Terminal Setup Command</p>
                <div className="p-2.5 bg-stone-900 text-amber-200 rounded-lg font-mono text-[11px]">
                  npx tsx scripts/setup-admin.ts &lt;email&gt; &lt;password&gt;
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsCheckingStatus(true);
                const s = await adminAuthService.checkStatus();
                setAuthStatus(s);
                setIsCheckingStatus(false);
              }}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Re-check Server Configuration Status
            </button>
          </div>
        ) : (
          /* Active Secure Authentication Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Server-side authenticated portal. Unauthorized access is monitored.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337] transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#881337] hover:bg-[#6e0f2c] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

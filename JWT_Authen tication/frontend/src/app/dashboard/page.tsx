'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  UserCheck,
  LogOut,
  Mail,
  Fingerprint,
  Calendar,
  Loader2,
  Lock,
  ShieldCheck,
  KeyRound,
  Server,
} from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome, {user?.name}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Authenticated
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Active session verified via signed JWT in HttpOnly cookie.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 font-semibold text-sm transition-all duration-200 flex items-center gap-2"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" /> Logout
            </>
          )}
        </button>
      </div>

      {/* Grid: User Info & Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User profile info card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" /> User Profile Information
          </h2>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" /> Email
              </span>
              <span className="text-sm font-medium text-slate-200">{user?.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 flex-shrink-0">
                <Fingerprint className="w-4 h-4 text-indigo-400" /> User ID
              </span>
              <span className="text-xs font-mono text-slate-300 truncate">{user?.id}</span>
            </div>

            {user?.createdAt && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" /> Member Since
                </span>
                <span className="text-xs text-slate-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Security & Token Architecture card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> Security & Cookie Architecture
          </h2>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm space-y-2.5 text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-slate-400">Cookie Type:</span>
              <span className="text-emerald-400 font-mono text-xs font-bold">HttpOnly, SameSite=Lax</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-slate-400">Storage Location:</span>
              <span className="text-emerald-400 font-mono text-xs font-bold">Encrypted Browser Cookie Jar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">XSS Vulnerability:</span>
              <span className="text-emerald-400 font-mono text-xs font-bold">PROTECTED (No JS Access)</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Requests automatically transmit credentials via <code className="text-blue-400">withCredentials: true</code>. The Express backend validates token signatures via <code className="text-indigo-400">authenticateJWT</code> middleware.
          </p>
        </div>
      </div>

      {/* Drop-in Integration Snippet for Developers */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" /> Drop-In Usage In Any Page
        </h3>
        <p className="text-xs text-slate-400">
          Guard any page in your app with a single wrapper component:
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300 font-mono overflow-x-auto">
{`import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Content only visible to logged in users!</div>
    </ProtectedRoute>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LogIn, UserPlus, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg text-white hover:opacity-90 transition-opacity"
        >
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="tracking-tight">
            JWT<span className="text-blue-500">Auth</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              pathname === '/'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-300">
                <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-all flex items-center gap-1.5"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  pathname === '/login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              <Link
                href="/register"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  pathname === '/register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

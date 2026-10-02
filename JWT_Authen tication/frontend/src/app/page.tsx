import Link from 'next/link';
import { ShieldCheck, KeyRound, Lock, Server, Database, ArrowRight, UserCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Secure Authentication Flow
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          JWT Authentication <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            with HttpOnly Cookies
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          A step-by-step production-grade authentication flow using Next.js App Router, Express, TypeScript, Prisma ORM, and PostgreSQL.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold border border-white/10 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 hover:text-white font-medium border border-white/5 transition-all duration-200 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" /> Go to Dashboard
          </Link>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">HttpOnly Cookie</h3>
            <p className="text-sm text-slate-400">
              JWT tokens are stored safely in HttpOnly cookies, protecting against XSS token theft.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Bcrypt Hashing</h3>
            <p className="text-sm text-slate-400">
              Passwords are salted and hashed with bcrypt. Plain passwords are never stored in the database.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">PostgreSQL & Prisma</h3>
            <p className="text-sm text-slate-400">
              Type-safe database queries and migrations powered by Prisma ORM and PostgreSQL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

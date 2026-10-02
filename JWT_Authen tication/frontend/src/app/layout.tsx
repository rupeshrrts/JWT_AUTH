import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'JWT Authentication System',
  description:
    'Production-grade JWT Authentication built with Next.js, Express, PostgreSQL, and HttpOnly Cookies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500">
            Production JWT Authentication Template • Next.js, Express & PostgreSQL
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

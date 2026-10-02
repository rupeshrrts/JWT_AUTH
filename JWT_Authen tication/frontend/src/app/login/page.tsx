'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await login(data);
      router.push('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.message || 'Invalid email or password'
        );
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-sm text-slate-400">
              Sign in to authenticate and receive your HttpOnly JWT cookie
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && <Alert type="error" message={serverError} />}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="rupesh@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Signing In..."
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

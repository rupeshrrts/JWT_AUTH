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
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.message || 'Failed to register. Please try again.'
        );
      } else {
        setServerError('An unexpected error occurred.');
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
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
            <p className="text-sm text-slate-400">
              Register to test the JWT registration and database flow
            </p>
          </div>

          {/* Feedback Alerts */}
          {serverError && <Alert type="error" message={serverError} />}
          {successMessage && <Alert type="success" message={successMessage} />}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Rupesh"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />

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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Creating Account..."
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Register
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

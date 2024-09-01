'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '@/app/actions';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const signUpSchema = z.object({
  name: z.string()
    .min(4, 'Name must be at least 4 characters')
    .max(20, 'Name must be at most 20 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp(data.name, data.email, data.password);
      if (result.success) {
        router.push('/sign-in');
      } else {
        setError(result.error || 'An error occurred during sign up');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        {/* <Image
          src="/hero-bg.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        /> */}
      </div>
      <div className="max-w-md w-full space-y-8 dark:bg-gray-900 bg-white p-10 rounded-xl shadow-2xl">
        <div className=''>
          <h2 className="mt-6 text-center text-3xl font-extrabold dark:text-white text-black">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm dark:text-white text-slate-400">
            Join Material LMS and start your learning journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                type="text"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                {...register('email')}
                type="email"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register('password')}
                type="password"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        <div className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
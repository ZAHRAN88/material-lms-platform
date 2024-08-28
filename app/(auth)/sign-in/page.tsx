'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '@/app/actions';
import { useAuth } from '@/lib/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Define the schema for form validation
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data: SignInFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);
      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          name: result.user.name || '',
          email: result.user.email
        });
        router.push('/'); // Redirect to dashboard on successful sign-in
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8  relative">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
       
      </div>
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl font-bold dark:text-white text-black mb-2">Welcome to Your Material LMS!</h1>
        <p className=" dark:text-white text-slate-400">Sign in to access your personalized learning experience.</p>
      </div>
      <Card className="w-full max-w-md dark:bg-gray-900 bg-white text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl dark:text-white text-black font-bold text-center">Sign in to Material</CardTitle>
          {/* <CardDescription className="text-center text-gray-400">
            Welcome back! Please sign in to continue
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="Email address"
                className="bg-gray-800 border-gray-700 text-white"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                {...register('password')}
                type="password"
                placeholder="Password"
                className="bg-gray-800 border-gray-700 text-white"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
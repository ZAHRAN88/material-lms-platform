'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '@/app/actions';
import { useAuth } from '@/lib/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data: SignInFormData) => {
    setError('');
    setIsLoading(true);
    setIsExiting(false);

    // {{ edit_1 }} Set default password if not provided
    const passwordToUse = data.password.trim() === '' ? 'Material2024' : data.password;

    try {
      const result = await signIn(data.email, passwordToUse); // {{ edit_2 }} Use the determined password
      if (result.success && result.user) {
        setUser({
          id: result.user.id,
          name: result.user.name || '',
          email: result.user.email
        });
        toast.success('Successfully signed in!');
        setIsExiting(true);
        setTimeout(() => router.push('/'), 300);
      } else {
        setError(result.error || 'Invalid email or password');
        toast.error(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}  text-white`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> {}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-opacity-30">
        {}
      </div>
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl font-bold dark:text-white text-gray-800 mb-2">Welcome to Your Material LMS!</h1>
        <p className="text-white">Sign in to access your personalized learning experience.</p>
      </div>
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Sign in to Material</CardTitle>
          <CardDescription className="text-center text-gray-400 dark:text-gray-400">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="Email address"
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500 font-semibold" aria-live="assertive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                {...register('password')}
                type="password"
                placeholder="Password"
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-500 font-semibold" aria-live="assertive">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500 font-semibold" aria-live="assertive">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2 hover:bg-blue-800 transition duration-300" disabled={isLoading}>
              {isLoading ? <span className="loader"></span> : 'Sign in'} {}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
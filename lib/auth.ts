import { User } from '@prisma/client';
import { db } from './db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  error?: string;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred during sign up');
    }

    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message || 'An error occurred during sign up' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    const { password: _, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'An error occurred during sign in' };
  }
}

export async function getUserFromToken() {
  const token = cookies().get('token')?.value;
	
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(process.env.JWT_SECRET!)
		);
		const userId = payload.userId as string;

		const user = await db.user.findUnique({
			where: { id: userId },
			select: { id: true, name: true, email: true, role: true }
		});

		if (!user) return null;

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		};
	} catch (error) {
		console.error('Failed to verify token:', error);
		return null;
	}
}

export async function updateUser(userId: string, data: Partial<User>): Promise<AuthResult> {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Update user error:', error);
    return { success: false, error: 'An error occurred while updating user' };
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'An error occurred while changing password' };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    return user;
  } catch (error) {
    console.error('Failed to get user by ID:', error);
    return null;
  }
}
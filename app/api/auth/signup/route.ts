import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ success: false, error: 'An error occurred during sign up' }, { status: 500 });
  }
}
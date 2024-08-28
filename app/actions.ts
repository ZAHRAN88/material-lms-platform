"use server"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from "../lib/db"
import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';

const buyCourse = async (formData: FormData) => {
   await db.purchase.create({
        data:{
            customerId: formData.get('customerId') as string,
            courseId: formData.get('courseId') as string
        }
    })
}
const addEngineer = async (formData:FormData)=>{
    await db.engineer.create({
        data:{
            name: formData.get('name') as string,
            times: {
                create: [
                    {
                        day: formData.get('day') as string,
                        time: formData.get('time') as string,
                        place: formData.get('place') as string,
                    }
                ]
            }
        }
    })
    
}
const addTimesToEngineer = async (formData:FormData)=>{
    await db.timeSlot.create({
        data:{
            engineerId: formData.get('engineerId') as string,
            day: formData.get('day') as string,
            time: formData.get('time') as string,
            place: formData.get('place') as string
        }
    })
}
const signUp = async (name: string, email: string, password: string) => {
	try {
		const existingUser = await db.user.findUnique({ where: { email } });
		if (existingUser) {
			return { success: false, error: 'Email already in use' };
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'USER'  // Set the default role to 'USER'
			}
		});

		return { 
			success: true, 
			user: { 
				id: user.id, 
				name: user.name, 
				email: user.email,
				role: user.role
			} 
		};
	} catch (error) {
		console.error('Sign up error:', error);
		return { success: false, error: 'An error occurred during sign up' };
	}
}
export async function signIn(email: string, password: string) {
	try {
		const user = await db.user.findUnique({ where: { email } });
		if (!user) {
			return { success: false, error: 'Invalid email or password' };
		}

		const isPasswordValid = await compare(password, user.password);
		if (!isPasswordValid) {
			return { success: false, error: 'Invalid email or password' };
		}

		// Create a JWT token
		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('1d')
			.sign(new TextEncoder().encode(process.env.JWT_SECRET));

		// Set the token in a cookie
		cookies().set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 86400, // 1 day
			path: '/',
		});

		return { success: true, user: { id: user.id, name: user.name, email: user.email } };
	} catch (error) {
		console.error('Sign in error:', error);
		return { success: false, error: 'An error occurred during sign in' };
	}
}
export {buyCourse , addEngineer , addTimesToEngineer , signUp }

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

export async function signOut() {
	cookies().delete('token');
	return { success: true };
}
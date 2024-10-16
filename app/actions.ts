"use server"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from "../lib/db"
import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';
import { Question } from "@prisma/client"; // Import Question model

const buyCourse = async (formData: FormData) => {
   await db.purchase.create({
        data:{
            customerId: formData.get('customerId') as string,
            courseId: formData.get('courseId') as string
        }
    })
}
type Engineer = {
    id: string;
    day: string;
    time: string;
    place: string;
    name: string;
    times: Time[];
}
const addEngineer = async (formData: FormData): Promise<Engineer> => {
    const engineer = await db.engineer.create({
        data: {
            name: formData.get('name') as string,
            times: {
                create: {
                    day: formData.get('day') as string,
                    time: formData.get('time') as string,
                    place: formData.get('place') as string
                }
            }
        },
        include: { times: true } 
    });

    return {
        id: engineer.id,
        name: engineer.name,
        day: engineer.times[0].day,
        time: engineer.times[0].time,
        place: engineer.times[0].place,
        times: engineer.times
    };
}
type Time = {
    day: string;
    time: string;
    place: string;
}
const addTimesToEngineer = async (formData: FormData): Promise<Time> => {
    const newTime = await db.timeSlot.create({
        data: {
            engineerId: formData.get('engineerId') as string,
            day: formData.get('day') as string,
            time: formData.get('time') as string,
            place: formData.get('place') as string
        }
    });
    return newTime;
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
				role: 'USER'  
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

		
		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('1d')
			.sign(new TextEncoder().encode(process.env.JWT_SECRET));

		
		cookies().set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 86400, 
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

export async function getInstructorCourses(instructorId: string) {
	return db.course.findMany({
		where: { instructorId },
		include: {
			sections: {
				include: {
					progress: true
				}
			},
			purchases: true
		}
	});
}


export async function getCommunities() {
	return db.community.findMany({
		include: {
			_count: {
				select: { members: true }
			}
		}
	});
}

export async function getRecentDiscussions() {
	return db.discussion.findMany({
		take: 10,
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: { name: true }
			}
		}
	});
}

export const updateEngineer = async (id: string, name: string) => {
    const updatedEngineer = await db.engineer.update({
        where: { id },
        data: { name },
    });
    return updatedEngineer;
};

export const updateTimeSlot = async (id: string, day: string, time: string, place: string) => {
    const updatedTimeSlot = await db.timeSlot.update({
        where: { id },
        data: { day, time, place },
    });
    return updatedTimeSlot;
};

import { Course, User, Level, Category } from "@prisma/client";

// Add this new type
type CourseWithDetails = Course & {
    instructor: User | null;
    membersCount: number;
    sectionsCount: number;
    level: Level | null;
    category: Category | null;
};

// Add this new action
export async function getCourseDetails(courseId: string): Promise<CourseWithDetails | null> {
    const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: true,
        },
    });

    if (!course) return null;

    const membersCount = await db.purchase.count({ where: { courseId } });
    const sectionsCount = await db.section.count({ where: { courseId } });
    const level = course.levelId ? await db.level.findUnique({ where: { id: course.levelId } }) : null;
    const category = course.categoryId ? await db.category.findUnique({ where: { id: course.categoryId } }) : null;

    return {
        ...course,
        instructor: course.instructor,
        membersCount,
        sectionsCount,
        level,
        category,
    };
}


export const getCourseWithSections = async (courseId: string) => {
  const sections = await db.section.findMany({
    where: {
      courseId: courseId
    },
    orderBy: {
      position: 'asc'
    }
  });

  return sections;
};
export async function getCourse(courseId: string) {
	try {
	  const course = await db.course.findUnique({
		where: { id: courseId },
	  });
  
	  if (!course) {
		throw new Error('Course not found');
	  }
  
	  return course;
	} catch (error) {
	  console.error('Failed to fetch course:', error);
	  throw error;
	}
  }
  export async function getLevelName(courseId: string): Promise<string | null> {
	const course = await db.course.findUnique({
	  where: { id: courseId },
	  select: { level: { select: { name: true } } },
	});
	return course?.level?.name ?? null;
  }
  
  export async function getInstructorName(courseId: string): Promise<string | null> {
	const course = await db.course.findUnique({
	  where: { id: courseId },
	  select: { instructor: { select: { name: true } } },
	});
	return course?.instructor?.name ?? null;
  }

// Add this new action
export const addQuestionToSection = async (formData: FormData, sectionId: string): Promise<Question> => {
    const questionText = formData.get('question') as string;
    const questionAns = formData.get('answer') as string;
	
    const question = await db.question.create({
        data: {
            answer: questionAns, 
            sectionId: sectionId,
            text: questionText 
        },
    });

    return question;
};

export const deleteTimeSlot = async (id: string) => {
    try {
        await db.timeSlot.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to delete time slot:', error);
        return { success: false, error: 'An error occurred while deleting the time slot' };
    }
};

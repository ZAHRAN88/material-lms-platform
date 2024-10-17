"use server"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from "../lib/db"
import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';
import { Question, Course, User, Level, Category } from "@prisma/client";
import { cache } from 'react';

// Cache frequently used database queries
const getCachedUser = cache(async (email: string) => {
    return await db.user.findUnique({ 
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true
        }
    });
});

// Optimized to use a single query
const buyCourse = async (formData: FormData) => {
    const customerId = formData.get('customerId') as string;
    const courseId = formData.get('courseId') as string;
    
    return await db.$transaction(async (tx) => {
        const purchase = await tx.purchase.create({
            data: { customerId, courseId }
        });
        return purchase;
    });
}

type Engineer = {
    id: string;
    day: string;
    time: string;
    place: string;
    name: string;
    times: Time[];
}

// Optimized to use transaction and single query
const addEngineer = async (formData: FormData): Promise<Engineer> => {
    return await db.$transaction(async (tx) => {
        const engineer = await tx.engineer.create({
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
    });
}

type Time = {
    day: string;
    time: string;
    place: string;
}

const addTimesToEngineer = async (formData: FormData): Promise<Time> => {
    return await db.$transaction(async (tx) => {
        return await tx.timeSlot.create({
            data: {
                engineerId: formData.get('engineerId') as string,
                day: formData.get('day') as string,
                time: formData.get('time') as string,
                place: formData.get('place') as string
            }
        });
    });
}
// Optimized signup with better error handling and single transaction
const signUp = async (name: string, email: string, password: string) => {
    return await db.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({ 
            where: { email },
            select: { id: true }
        });

        if (existingUser) {
            return { success: false, error: 'Email already in use' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return { success: true, user };
    }).catch(error => {
        console.error('Sign up error:', error);
        return { success: false, error: 'An error occurred during sign up' };
    });
}

// Cached token verification
const verifyToken = cache(async (token: string) => {
    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return payload;
});

export async function signIn(email: string, password: string) {
    try {
        const user = await getCachedUser(email);
        
        if (!user || !(await compare(password, user.password))) {
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

        return { 
            success: true, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: 'An error occurred during sign in' };
    }
}

// Optimized to cache user data
export const getUserFromToken = cache(async () => {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        const userId = payload.userId as string;

        return await db.user.findUnique({
            where: { id: userId },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                role: true 
            }
        });
    } catch (error) {
        console.error('Failed to verify token:', error);
        return null;
    }
});

export async function signOut() {
    cookies().delete('token');
    return { success: true };
}

// Optimized to use efficient includes and select
export async function getInstructorCourses(instructorId: string) {
    return db.course.findMany({
        where: { instructorId },
        include: {
            sections: {
                include: {
                    progress: {
                        select: {
                            id: true,
                            isCompleted: true
                        }
                    }
                }
            },
            purchases: {
                select: {
                    id: true,
                    createdAt: true
                }
            }
        }
    });
}

// Cached community query
export const getCommunities = cache(async () => {
    return db.community.findMany({
        include: {
            _count: {
                select: { members: true }
            }
        }
    });
});

// Cached recent discussions
export const getRecentDiscussions = cache(async () => {
    return db.discussion.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { name: true }
            }
        }
    });
});

export const updateEngineer = async (id: string, name: string) => {
    return await db.$transaction(async (tx) => {
        return await tx.engineer.update({
            where: { id },
            data: { name },
        });
    });
};

export const updateTimeSlot = async (id: string, day: string, time: string, place: string) => {
    return await db.$transaction(async (tx) => {
        return await tx.timeSlot.update({
            where: { id },
            data: { day, time, place },
        });
    });
};

type CourseWithDetails = Course & {
    instructor: User | null;
    membersCount: number;
    sectionsCount: number;
    level: Level | null;
    category: Category | null;
};

// Optimized to use a single query with aggregations
export const getCourseDetails = cache(async (courseId: string): Promise<CourseWithDetails | null> => {
    const courseData = await db.$transaction(async (tx) => {
        const [course, counts] = await Promise.all([
            tx.course.findUnique({
                where: { id: courseId },
                include: {
                    instructor: true,
                    level: true,
                    category: true,
                    _count: {
                        select: {
                            purchases: true,
                            sections: true
                        }
                    }
                }
            }),
            tx.purchase.count({ where: { courseId } })
        ]);

        if (!course) return null;

        return {
            ...course,
            instructor: course.instructor,
            membersCount: counts,
            sectionsCount: course._count.sections,
            level: course.level,
            category: course.category
        };
    });

    return courseData;
});

// Cached section query
export const getCourseWithSections = cache(async (courseId: string) => {
    return db.section.findMany({
        where: { courseId },
        orderBy: { position: 'asc' }
    });
});

// Cached course query
export const getCourse = cache(async (courseId: string) => {
    const course = await db.course.findUnique({
        where: { id: courseId }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    return course;
});

// Cached level name query
export const getLevelName = cache(async (courseId: string): Promise<string | null> => {
    const course = await db.course.findUnique({
        where: { id: courseId },
        select: { level: { select: { name: true } } }
    });
    return course?.level?.name ?? null;
});

// Cached instructor name query
export const getInstructorName = cache(async (courseId: string): Promise<string | null> => {
    const course = await db.course.findUnique({
        where: { id: courseId },
        select: { instructor: { select: { name: true } } }
    });
    return course?.instructor?.name ?? null;
});

export const addQuestionToSection = async (formData: FormData, sectionId: string): Promise<Question> => {
    return await db.$transaction(async (tx) => {
        return await tx.question.create({
            data: {
                answer: formData.get('answer') as string,
                sectionId: sectionId,
                text: formData.get('question') as string
            }
        });
    });
};

export const deleteTimeSlot = async (id: string) => {
    try {
        return await db.$transaction(async (tx) => {
            await tx.timeSlot.delete({
                where: { id }
            });
            return { success: true };
        });
    } catch (error) {
        console.error('Failed to delete time slot:', error);
        return { success: false, error: 'An error occurred while deleting the time slot' };
    }
};
export{addEngineer,addTimesToEngineer,buyCourse,signUp}

"use server"

import { revalidatePath } from "next/cache"
import { db } from "./db"
import { getUserFromToken } from "./auth"

export const Admins = async () => {
	const admins = await db.user.findMany({
		where: { role: 'ADMIN' },
		select: { id: true },
	});
	return admins;
}

type ResourceState = "Course Enrolled Successfully" | "Error enrolling Course" | null;

type EnrollmentResult = {
    success: boolean;
    message?: string;
    error?: string;
};

export const enrollCourse = async (formData: FormData): Promise<EnrollmentResult> => {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const courseId = formData.get('courseId') as string;
        if (!courseId) {
            return { success: false, error: "Course ID is missing" };
        }

        // Check if the user is already enrolled
        const existingEnrollment = await db.purchase.findUnique({
            where: {
                customerId_courseId: {
                    customerId: user.id,
                    courseId: courseId
                }
            }
        });

        if (existingEnrollment) {
            return { success: false, error: "You are already enrolled in this course" };
        }

        await db.purchase.create({
            data: {
                customerId: user.id,
                courseId: courseId
            }
        });
        
        revalidatePath('/(course)/courses/[courseId]', 'page');
        return { success: true, message: "Course Enrolled Successfully" };
    } catch (e) {
        console.error("Error enrolling in course:", e);
        return { success: false, error: e instanceof Error ? e.message : "Unknown error occurred" };
    }
}

export const fetchEngineers = async () => {
    try {
      return await db.engineer.findMany({
        include: { times: true },
      });
    } catch (error) {
      console.error("Error fetching engineers:", error);
      throw error;
    }
};

export const createCourse = async (data: {
  title: string;
  categoryId: string;
  subCategoryId: string;
}): Promise<{ success: boolean; error?: string; courseId?: string }> => {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const course = await db.course.create({
      data: {
        title: data.title,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        instructorId: user.id,
      },
      include: { instructor: true }, // Include the instructor to ensure it's not null
    });

    if (!course.instructor) {
      throw new Error("Failed to associate instructor with course");
    }

    revalidatePath('/instructor/courses');
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}
export const getUserEnrolledCourses = async () => {
  try {
    const user = await getUserFromToken();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const enrolledCourses = await db.purchase.findMany({
      where: {
        customerId: user.id,
      },
      include: {
        course: {
          include: {
            category: true,
            subCategory: true,
            instructor: true,
            sections: {
              include: {
                progress: {
                  where: {
                    studentId: user.id
                  }
                }
              }
            }
          },
        },
      },
    });

    return enrolledCourses.map(enrollment => {
      const course = enrollment.course;
      const totalSections = course.sections.length;
      const completedSections = course.sections.filter(section => 
        section.progress.some(p => p.isCompleted)
      ).length;
      const remainingSections = totalSections - completedSections;
      const progress = totalSections > 0 
        ? Math.round((completedSections / totalSections) * 100) 
        : 0;

      return {
        ...course,
        totalSections,
        completedSections,
        remainingSections,
        progress
      };
    });
  } catch (error) {
    console.error("Error fetching user enrolled courses:", error);
    throw error;
  }
};

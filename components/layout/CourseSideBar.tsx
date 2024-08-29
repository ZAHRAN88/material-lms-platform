import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { MotionDiv } from "../MotionDiv";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names

interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  const publishedSections = await db.section.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id,
      },
    },
  });

  const completedSections = await db.progress.count({
    where: {
      studentId,
      sectionId: {
        in: publishedSectionIds,
      },
      isCompleted: true,
    },
  });

  const progressPercentage =
    (completedSections / publishedSectionIds.length) * 100;

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5, damping: 10, stiffness: 100, type: "spring" }}
      className="hidden md:flex flex-col h-screen w-64 border border-gray-200 dark:border-gray-700 shadow-lg p-5 my-4 rounded-md text-sm font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{Math.round(progressPercentage)}% completed</p>
          <Progress value={progressPercentage} className="h-3 mt-2" />
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={cn(
          "p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 my-4",
          "transition-colors duration-200"
        )}
      >
        Overview
      </Link>
      {publishedSections.map((section, index) => (
        <Link
          key={section.id}
          href={`/courses/${course.id}/sections/${section.id}`}
        >
          <MotionDiv 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: index * 0.3 }}
            className={cn(
              "p-3 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mt-4",
              "transition-colors duration-200"
            )}
          >
            {section.title}
          </MotionDiv>
        </Link>
      ))}
    </MotionDiv>
  );
};

export default CourseSideBar;

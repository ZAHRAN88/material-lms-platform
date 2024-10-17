import React from "react";
import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { MotionDiv } from "../MotionDiv";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle, LayoutDashboard } from "lucide-react";

interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
  currentSectionId?: string;
}

export const calculateProgressPercentage = async (courseId: string, studentId: string) => {
  const publishedSections = await db.section.findMany({
    where: { courseId: courseId, isPublished: true },
    orderBy: { position: "asc" },
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const completedSections = await db.progress.count({
    where: {
      studentId,
      sectionId: { in: publishedSectionIds },
      isCompleted: true,
    },
  });

  return (completedSections / publishedSectionIds.length) * 100;
};

const CourseSideBar = async ({ course, studentId, currentSectionId }: CourseSideBarProps) => {
  const publishedSections = await db.section.findMany({
    where: { courseId: course.id, isPublished: true },
    orderBy: { position: "asc" },
  });

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id,
      },
    },
  });

  const progressPercentage = await calculateProgressPercentage(course.id, studentId);

  const completedSections = await db.progress.findMany({
    where: {
      studentId,
      sectionId: { in: publishedSections.map(s => s.id) },
      isCompleted: true,
    },
  });

  const completedSectionIds = new Set(completedSections.map(s => s.sectionId));

  return (
    <div className="h-screen border-r flex flex-col rounded-md shadow-sm bg-gray-50 dark:bg-slate-800">
      <div className="p-8 flex flex-col border-b dark:border-gray-700 text-gray-700">
        <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-500 mb-4">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-4">
            <Progress
              value={progressPercentage}
              className="h-2"
            />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
              {Math.round(progressPercentage)}% completed
            </p>
          </div>
        )}
      </div>
      <nav className="flex flex-col w-full p-4 space-y-2">
        <Link
          href={`/courses/${course.id}/overview`}
          className={cn(
            "flex items-center gap-x-2 text-gray-700 dark:text-gray-300 text-sm font-medium p-3 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700",
            currentSectionId === undefined && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold"
          )}
        >
          <LayoutDashboard size={20} />
          Overview
        </Link>
        {publishedSections.map((section) => (
          <MotionDiv
            key={section.id}
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href={`/courses/${course.id}/sections/${section.id}`}
              className={cn(
                "flex items-center gap-x-2 text-gray-700 dark:text-gray-300 text-sm font-medium p-3 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700",
                currentSectionId === section.id && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold shadow-md"
              )}
            >
              {completedSectionIds.has(section.id) ? (
                <CheckCircle size={20} className="text-green-500 dark:text-green-400" />
              ) : (
                <BookOpen size={20} className={cn(
                  currentSectionId === section.id ? "text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
                )} />
              )}
              {section.title}
            </Link>
          </MotionDiv>
        ))}
      </nav>
    </div>
  );
};

export default CourseSideBar;
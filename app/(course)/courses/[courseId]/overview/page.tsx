// CourseOverviewPage.tsx
import { Suspense } from "react";
import {
  getCourse,
  getCourseWithSections,
  getLevelName,
  getInstructorName,
} from "@/app/actions";
import CourseOverviewClient from "./CourseOverviewClient";
import { getUserFromToken } from "@/app/actions";
import { db } from "@/lib/db";

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-4 w-2/3">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

interface CourseOverviewPageProps {
  params: { courseId: string };
}

export const revalidate = 3600; // Revalidate every hour

export default async function CourseOverviewPage({
  params,
}: CourseOverviewPageProps) {
  const coursePromise = getCourse(params.courseId);
  const sectionsPromise = getCourseWithSections(params.courseId);
  const levelNamePromise = getLevelName(params.courseId);
  const instructorNamePromise = getInstructorName(params.courseId);
  const calculateProgressPercentage = async (
    courseId: string,
    studentId: string
  ) => {
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

  const [course, sections, levelName, instructorName] = await Promise.all([
    coursePromise,
    sectionsPromise,
    levelNamePromise,
    instructorNamePromise,
  ]);
  const user = await getUserFromToken();
  const progressPercentage = await calculateProgressPercentage(course.id, user!.id);
const completedSections=()=>{}
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CourseOverviewClient
        course={course}
        sections={sections}
        levelName={levelName}
        instructorName={instructorName}
        progress={progressPercentage}
      />
    </Suspense>
  );
}

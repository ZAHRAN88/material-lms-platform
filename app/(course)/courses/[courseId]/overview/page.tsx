import { Suspense } from "react";
import dynamic from 'next/dynamic';
import { Clock, Book, User } from "lucide-react"; 

import { getCourse, getCourseWithSections, getLevelName, getInstructorName } from "@/app/actions";

const ReadText = dynamic(() => import("@/components/custom/ReadText"), { ssr: false });
const SectionMenu = dynamic(() => import("@/components/layout/SectionMenu"), { ssr: false });
const MotionDiv = dynamic(() => import("@/components/MotionDiv").then(mod => mod.MotionDiv), { ssr: false });
const MotionP = dynamic(() => import("@/components/MotionDiv").then(mod => mod.MotionP), { ssr: false });

const LoadingSkeleton = () => (
  <div className="px-6 py-4 flex flex-col gap-5 animate-pulse">
    <div className="h-8 bg-gray-200 w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 w-1/2"></div>
    <div className="flex gap-2 items-center">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 w-1/4"></div>
    </div>
    <div className="h-4 bg-gray-200 w-1/5"></div>
    <div className="h-20 bg-gray-200 w-full"></div>
  </div>
);

interface CourseOverviewPageProps {
  params: { courseId: string };
}

export const revalidate = 3600; // Revalidate every hour

export default async function CourseOverviewPage({ params }: CourseOverviewPageProps) {
  const coursePromise = getCourse(params.courseId);
  const sectionsPromise = getCourseWithSections(params.courseId);
  const levelNamePromise = getLevelName(params.courseId);
  const instructorNamePromise = getInstructorName(params.courseId);

  const [course, sections, levelName, instructorName] = await Promise.all([
    coursePromise,
    sectionsPromise,
    levelNamePromise,
    instructorNamePromise
  ]);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-8 flex flex-col w-[90%] mt-4 h-screen mx-auto gap-6 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <SectionMenu course={{ ...course, sections }} />
        </div>

        <MotionP
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          {course.subtitle}
        </MotionP>

        <div className="flex flex-wrap gap-6 text-gray-700 dark:text-gray-300">
          {instructorName && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{instructorName}</span>
            </div>
          )}
          {levelName && (
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              <span>{`Level ${levelName}`}</span>
            </div>
          )}
        </div>

        {course.description ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Description:</h2>
            <div className="prose dark:prose-invert">
              <ReadText value={course.description} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center font-medium text-gray-500 dark:text-gray-400 mt-4">
            <p>Description is not provided.</p>
          </div>
        )}
      </MotionDiv>
    </Suspense>
  );
};
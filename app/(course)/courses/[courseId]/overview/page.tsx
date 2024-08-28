import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";
import { MotionDiv, MotionP } from "@/components/MotionDiv";
import { getUserFromToken } from "@/app/actions";

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

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MotionDiv
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-4 flex flex-col gap-5 text-sm"
      >
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <SectionMenu course={course} />
        </div>

        <MotionP
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-medium"
        >
          {course.subtitle}
        </MotionP>

        <div className="flex gap-2 items-center">
          <Image
            src="/avatar_placeholder.jpg"
            alt={`${course.instructor.name}'s photo`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="font-bold">Instructor:</p>
          <p>{course.instructor.name}</p>
        </div>

        <div className="flex gap-2">
          <p className="font-bold">Level:</p>
          <p>{level?.name}</p>
        </div>

        {course.description ? (
          <div className="flex flex-col gap-2">
            <p className="font-bold">Description:</p>
            <ReadText value={course.description} />
          </div>
        ) : (
          <div className="flex items-center justify-center font-bold">
            <p>Description is not provided.</p>
          </div>
        )}
      </MotionDiv>
    </Suspense>
  );
};

export default CourseOverview;
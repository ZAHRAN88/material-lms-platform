import { db } from "@/lib/db";
import { getUserById } from "@/lib/auth"; // Import your custom auth function
import { Course, Section, User } from "@prisma/client";
import { Gem, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MotionDiv } from "../MotionDiv";

const CourseCard = async ({ course }: { course: Course }) => {
  const instructor = await getUserById(course.instructorId);

  let level;
  let membersCount = await db.purchase.count({
    where: { courseId: course.id },
  });
  let sectionsCount = await db.section.count({
    where: {
      courseId: course.id,
    },
  });
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }
  const lastUpdate = new Date(course.updatedAt);
  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - lastUpdate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <>
      <Link href={`/courses/${course.id}/overview`} className="relative">
        <p className="absolute top-5 left-0 z-50 text-sm rounded-r-sm font-semibold rounded-l-none dark:text-[#003285] bg-[#003285] dark:border-spacing-3 dark:border-[#003285] shadow-md px-3 py-1 text-white dark:bg-white">
          {course.subCategoryId === "0fd2caa0-ccf4-4aa3-8f80-62f927e176c4"
            ? "Basmaga"
            : "Programming"}
        </p>
        <MotionDiv>
          <Image
            src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
            alt={course.title}
            width={500}
            height={300}
            className="rounded-t-xl w-[320px] h-[180px] object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110 group-hover:skew-y-2"
          />
          <div className="px-4 py-3 flex flex-col gap-2">
            <h2 className="text-lg font-bold group-hover:text-blue-700 dark:group-hover:text-slate-300 transition-colors duration-100 ease-in-out">
              {course.title}
            </h2>
            <div className="flex justify-between text-sm font-medium">
              {instructor && (
                <div className="flex gap-2 items-center">
                  <Image
                    src={
                      
                         "/avatar_placeholder.jpg"
                    }
                    alt={
                      instructor.name
                        ? instructor.name
                        : "Instructor photo"
                    }
                    width={30}
                    height={30}
                    className="rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex flex-col">
                    <p>{instructor.name}</p>
                    <div className="flex gap-8 justify-between">
                      <p className="text-sm font-medium rounded text-gray-600 dark:text-gray-400">
                        {sectionsCount}{" "}
                        {`${sectionsCount === 1 ? "Week" : "Weeks"}`}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-sm font-medium rounded text-gray-600 dark:text-gray-400">
                          {membersCount}{" "}
                        </p>
                        <UsersRound width={15} height={15} className="text-[#003285] dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {level && (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`rounded-full w-6 h-6 flex items-center justify-center ${
                      level.name === "3" ? "bg-blue-800" : "bg-slate-400"
                    } ${level.name === "1" ? "bg-green-600" : ""}`}
                  >
                    <p className="font-bold text-white">{level.name}</p>
                  </div>
                </div>
              )}
            </div>

            {course.price === 0 ? null : (
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                $ {course.price}
              </p>
            )}
          </div>
        </MotionDiv>
      </Link>
    </>
  );
};

export default CourseCard;

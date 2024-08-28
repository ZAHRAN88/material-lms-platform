import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { MotionDiv } from "../MotionDiv";

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
    transition={{ duration: 0.5, delay: 0.5,  damping: 10, stiffness: 100, type: "spring" }}

    className="hidden md:flex flex-col h-screen w-64 border shadow-lg p-5  my-4 rounded-md text-sm font-medium">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div>
          <p className="text-xs">{Math.round(progressPercentage)}% completed</p>
          <Progress value={progressPercentage} className="h-3 mt-2" />
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#9aabbda1] my-4`}
      >
        Overview
      </Link>
      {publishedSections.map((section ,index) => (
        <><Link
        key={section.id}
        href={`/courses/${course.id}/sections/${section.id}`}
        className=""
      >
          <MotionDiv 
          
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 , ease: "easeInOut", delay: index * 0.3 }}
          className="p-3 w-full rounded-lg hover:bg-[#9aabbda1] mt-4"
          >
            
              {section.title}
          </MotionDiv>
            </Link>
        </>
      ))}
    </MotionDiv>
  );
};

export default CourseSideBar;

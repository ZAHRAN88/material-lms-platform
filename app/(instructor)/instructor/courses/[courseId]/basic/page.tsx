import { Suspense } from "react";
import { redirect } from "next/navigation";

import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBanner";
import { db } from "@/lib/db";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { getUserFromToken } from "@/app/actions";
const CourseData = async ({ params }: { params: { courseId: string } }) => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const specificUserId = 'user_2jwilhi4UHfVpPyD2U2wvNx5rmr'; 

  let course;
  if (user.id === specificUserId) {
    course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        sections: true,
      },
    });
  } else {
    course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: user.id,
      },
      include: {
        sections: true,
      },
    });
  }

  if (!course) {
    return redirect("/instructor/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const levels = await db.level.findMany({
    
  });

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.subCategoryId,
    course.levelId,
    course.imageUrl,
    course.price,
    course.sections.some((section) => section.isPublished),
  ];
  const requiredFieldsCount = requiredFields.length;
  const missingFields = requiredFields.filter((field) => !Boolean(field));
  const missingFieldsCount = missingFields.length;
  const isCompleted = missingFieldsCount === 0;

  return (
    <>
      {/* <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      /> */}
      <EditCourseForm
        course={course}
        categories={categories.map((category) => ({
          label: category.name,
          value: category.id,
          subCategories: category.subCategories.map((subcategory) => ({
            label: subcategory.name,
            value: subcategory.id,
          })),
        }))}
        levels={levels.map((level) => ({
          label: level.name,
          value: level.id,
        }))}
        isCompleted={isCompleted}
      />
    </>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <CourseSkeleton />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const CourseBasics = ({ params }: { params: { courseId: string } }) => {
  return (
    <div className="px-10">
      <Suspense fallback={<LoadingSkeleton />}>
        <CourseData params={params} />
      </Suspense>
    </div>
  );
};

export default CourseBasics;
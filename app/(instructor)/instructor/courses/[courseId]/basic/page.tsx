import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBanner";
import { db } from "@/lib/db";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { getUserFromToken } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="w-full bg-transparent mx-auto rounded-lg">
      <div className="mb-8">
        <Link href="/instructor/courses">
          <Button variant="ghost" className="text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Basics</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Fill in the details below to set up your course. You can always edit these later.
          </p>
        </div>

        <div className="p-6">
          {/* <AlertBanner
            isCompleted={isCompleted}
            missingFieldsCount={missingFieldsCount}
            requiredFieldsCount={requiredFieldsCount}
          />
 */}
          <div className="mt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="p-6">
        <CourseSkeleton />
      </div>
    </div>
  </div>
);

const CourseBasics = ({ params }: { params: { courseId: string } }) => {
  return (
    <div className="min-h-screen  rounded-lg dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <CourseData params={params} />
      </Suspense>
    </div>
  );
};

export default CourseBasics;
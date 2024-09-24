import { db } from "@/lib/db";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { MotionDiv } from "@/components/MotionDiv";
import { Suspense } from "react";
import Link from "next/link";
import HeroSection from "@/components/home";

const CourseList = async () => {
  const courses = await getCoursesByCategory(null);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">No Courses Available Yet</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          We&apos;re working on bringing you amazing courses. Please check back soon for new learning opportunities!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-7 items-center px-10 m-auto justify-center">
      {courses.map((course) => (
        <MotionDiv
          key={course.id}
          className="border rounded-lg shadow-sm cursor-pointer overflow-hidden justify-start group hover:translate-y-3 hover:shadow-md transition-all ease-in-out duration-300 delay-75"
        >
          <CourseCard course={course} />
        </MotionDiv>
      ))}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-wrap gap-7 items-center m-auto justify-center">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="w-72">
        <CourseSkeleton />
      </div>
    ))}
  </div>
);

export default async function Home() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return (
    <div>
   
      <HeroSection/>
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">

      <Categories categories={categories} selectedCategory={null} />
      <Suspense fallback={<LoadingSkeleton />}>
        <CourseList />
      </Suspense>
      </div>

    </div>
  );
}
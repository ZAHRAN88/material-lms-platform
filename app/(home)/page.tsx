import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { db } from "@/lib/db";
import Categories from "@/components/custom/Categories";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { MotionDiv } from "@/components/MotionDiv";
import HeroSection from "@/components/home";

const CourseList = dynamic(() => import('@/components/courses/CourseList'), {
  loading: () => <LoadingSkeleton />,
});

const LoadingSkeleton = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center"
  >
    {[...Array(6)].map((_, index) => (
      <div key={index} className="w-full">
        <CourseSkeleton />
      </div>
    ))}
  </MotionDiv>
);

export default async function Home() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { subCategories: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="min-h-screen ">
      <HeroSection />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Explore Courses by Category
          </h2>
          <Categories categories={categories} selectedCategory={null} />
        </MotionDiv>
        
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Courses
          </h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <CourseList />
          </Suspense>
        </MotionDiv>
      </main>
    </div>
  );
}
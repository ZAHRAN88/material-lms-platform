import { Suspense } from "react";
import getCoursesByCategory from "@/app/actions/getCourses";
import CourseCard from "@/components/courses/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 w-full mb-4"></div>
    <div className="flex flex-wrap gap-7 justify-center">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="w-64 h-80 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const NoCourses = ({ categoryName }: { categoryName: string }) => (
  <div className="text-center py-10">
    <h2 className="text-2xl font-semibold mb-4">No Courses Available</h2>
    <p className="text-gray-600">
      There are currently no courses available for the {categoryName} category.
    </p>
    <p className="text-gray-600 mt-2">
      Please check back later or explore other categories.
    </p>
  </div>
);

const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categoriesPromise = db.category.findMany({
    orderBy: {
      name: "asc",
    },
    
  });

  const coursesPromise = getCoursesByCategory(params.categoryId);

  const [categories, courses] = await Promise.all([categoriesPromise, coursesPromise]);

  const currentCategory = categories.find(cat => cat.id === params.categoryId);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Suspense fallback={<SkeletonLoader />}>
        <Categories categories={categories} selectedCategory={params.categoryId} />
        {courses.length > 0 ? (
          <div className="flex flex-wrap gap-7 justify-center">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <NoCourses categoryName={currentCategory?.name || 'selected'} />
        )}
      </Suspense>
    </div>
  );
};

export default CoursesByCategory;
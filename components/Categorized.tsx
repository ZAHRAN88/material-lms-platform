import { GetStaticProps, GetStaticPaths } from "next";
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

const CoursesCategory = ({ categories, courses, categoryId }: { categories: any[], courses: any[], categoryId: string }) => {
  const currentCategory = categories.find(cat => cat.id === categoryId);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories categories={categories} selectedCategory={categoryId} />
      {courses.length > 0 ? (
        <div className="flex flex-wrap gap-7 justify-center">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <NoCourses categoryName={currentCategory?.name || 'selected'} />
      )}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await db.category.findMany();
  const paths = categories.map(category => ({
    params: { categoryId: category.id },
  }));

  return { paths, fallback: 'blocking' }; // Use 'blocking' for SSR on non-pre-rendered paths
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const courses = await getCoursesByCategory(params?.categoryId as string);

  return {
    props: {
      categories,
      courses,
      categoryId: params?.categoryId,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

export default CoursesCategory;

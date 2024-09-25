import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/db"
import { Suspense } from "react";

const SearchResults = async ({ queryText }: { queryText: string }) => {
  const courses = await db.course.findMany({
    
    where: {
      isPublished: true,
      OR: [
        { title: { contains: queryText, mode: 'insensitive' } }, 
        { category: { name: { contains: queryText, mode: 'insensitive' } }}, 
        { subCategory: { name: { contains: queryText, mode: 'insensitive' } }} 
      ]
    },
    include: {
      
      category: true,
      subCategory: true,
      level: true,
      sections: {
        where: {
          isPublished: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const SearchPage = ({ searchParams }: { searchParams: { query: string }}) => {
  const queryText = searchParams.query || ''

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">Recommended courses for {queryText}</p>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults queryText={queryText} />
      </Suspense>
    </div>
  )
}
const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full sm:w-[280px] animate-pulse">
      <div className="w-full h-40 bg-gray-300 rounded-md mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};
const SearchSkeleton = () => (
  <div className="flex gap-4 flex-wrap">
    {[...Array(6)].map((_, index) => (
      <CourseCardSkeleton key={index} /> 
    ))}
  </div>
);

export default SearchPage
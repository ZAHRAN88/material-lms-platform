import getCoursesByCategory from "@/app/actions/getCourses";
import { MotionDiv } from "../MotionDiv";
import CourseCard from "./CourseCard";

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

  export default CourseList
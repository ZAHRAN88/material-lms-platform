import React from 'react';
import getCoursesByCategory from "@/app/actions/getCourses";
import { MotionDiv } from "../MotionDiv";
import CourseCard from "./CourseCard";

const CourseList = async () => {
  const courses = await getCoursesByCategory(null);

  if (courses.length === 0) {
    return (
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          No Courses Available Yet
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl">
          We are working hard to bring you amazing courses. Please check back soon for exciting new learning opportunities!
        </p>
        <MotionDiv
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </MotionDiv>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8"
    >
      {courses.map((course, index) => (
        <MotionDiv
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <CourseCard course={course} />
        </MotionDiv>
      ))}
    </MotionDiv>
  );
};

export default CourseList;
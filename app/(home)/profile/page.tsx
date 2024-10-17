"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { getUserEnrolledCourses } from "@/lib/actions";
import Link from "next/link";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { TextEffect } from "@/components/TextEffect";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  progress: number;
  totalSections: number;
  completedSections: number;
  remainingSections: number;
  category: { id: string; name: string };
  subCategory: { id: string; name: string; categoryId: string };
  totalLessons: number;
  completedLessons: number;
}

function calculateTotalProgress(courses: Course[]): number {
  if (courses.length === 0) return 0;
  const totalProgress = courses.reduce(
    (sum, course) => sum + course.progress,
    0
  );
  return Math.round(totalProgress / courses.length);
}

export default function UserCourseProgress() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getUserEnrolledCourses();
        setCourses(
          data.map((course) => ({
            ...course,
            totalLessons: course.totalSections * 5,
            completedLessons: course.completedSections * 5,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalProgress = calculateTotalProgress(courses);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading courses...
        </span>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-center p-4 bg-red-100 rounded-lg shadow"
      >
        Error: {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 px-6 flex flex-col"
    >
      <TextEffect
        className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
        as="h2"
        per="char"
        preset="blur"
      >
        Your Learning Journey
      </TextEffect>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/courses/${course.id}/overview`} className="block">
              <Card className="hover:shadow-lg transition-all duration-300 h-full transform hover:scale-105">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedProgress progress={course.progress} />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <Badge
                      variant={course.progress === 100 ? "secondary" : "default"}
                      className="text-sm mb-2 sm:mb-0"
                    >
                      <AnimatedNumber value={course.progress} />% Complete
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {course.completedSections}/{course.totalSections} sections
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{course.totalSections} Sections</span>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>{course.completedSections} Completed</span>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>{course.remainingSections} Remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {totalProgress < 100 && totalProgress !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="justify-center items-center hidden  flex-col text-center h-64 sm:flex px-3"
        >
          <TextRevealCard
            text={`Overall Progress: ${totalProgress}%`}
            revealText="Keep going!"
            className=" text-white border-none text-center p-6 rounded-lg shadow-lg"
          >
            <TrendingUp className="w-8 h-8 mb-4" />
          </TextRevealCard>
        </motion.div>
      )}

      {totalProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="justify-center items-center flex flex-col text-center h-64 sm:flex px-3"
        >
          <TextRevealCard
            text={`Overall Progress: ${totalProgress}%`}
            revealText="Congratulations on completing all courses!"
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-none text-center p-6 rounded-lg shadow-lg"
          >
            <CheckCircle className="w-8 h-8 mb-4" />
          </TextRevealCard>
        </motion.div>
      )}

      {courses.length === 0 && totalProgress === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="justify-center items-center flex flex-col text-center h-64 sm:flex px-3"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            You have not enrolled in any courses yet.
          </h2>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/">Explore Courses</Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

function AnimatedProgress({ progress }: { progress: number }) {
  const roundedWidth = useCustomWidth(progress);

  return (
    <Progress value={progress} className="h-2 mb-4">
      <motion.div
        className="h-full bg-primary rounded-full"
        style={{ width: roundedWidth.asPercent() }}
      />
    </Progress>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    animate(count, value, { duration: 1 });
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

function useCustomWidth(progress: number): { asPercent: () => string } {
  const width = useMotionValue(0);
  useEffect(() => {
    animate(width, progress);
  }, [width, progress]);
  return { asPercent: () => `${width.get()}%` };
}
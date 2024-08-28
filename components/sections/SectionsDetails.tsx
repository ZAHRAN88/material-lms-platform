"use client";

import {
  Course,
  MuxData,
  Progress,
  Purchase,
  Resource,
  Section,
} from "@prisma/client";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { File, Lock } from "lucide-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";
import { buyCourse } from "@/app/actions";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import Spinner from "./Spinner";
import { MotionDiv, MotionH1 } from "../MotionDiv";
import Confetti from "confetti-react";

import useWindowSize from "react-use/lib/useWindowSize";
import { Button } from "../ui/button";

import { Suspense } from "react";
import ReadText from "../custom/ReadText";
import { useAuth } from "@/lib/AuthContext";
import { enrollCourse } from "@/lib/actions";

const LoadingSkeleton = () => (
  <div className="px-6 py-4 flex flex-col gap-5 animate-pulse">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
      <div className="flex gap-4">
        <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
      </div>
    </div>
    <div className="h-20 bg-gray-200 w-full"></div>
    <div>
      <div className="h-6 bg-gray-200 w-1/4 mb-5"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-200 w-full mb-4 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const SectionsDetails = ({
  course,
  section,
  purchase,
  muxData,
  resources,
  progress,
  path,
}: {
  course: Course & { sections: Section[] };
  section: Section;
  purchase: Purchase | null;
  muxData: MuxData | null;
  resources: Resource[];
  progress: Progress | null;
  path: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const router = useRouter();
  const { user } = useAuth();

  const isPurchased = purchase?.customerId === user?.id;
  const isLocked = !purchase && !section.isFree;

  const handleEnrollment = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to enroll in a course");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('courseId', course.id);

      const result = await enrollCourse(formData);
      if (result.success) {
        toast.success(result.message || 'Enrollment successful');
        setRunConfetti(true);
        router.refresh();
        setTimeout(() => setRunConfetti(false), 3000);
      } else {
        toast.error(result.error || "An error occurred during enrollment");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, course.id, router]);

  useEffect(() => {
    const handleClick = () => setRunConfetti(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {section ? (
        <div className="px-6 py-4 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <MotionH1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold max-md:mb-4"
            >
              {section.title}
            </MotionH1>

            <div className="flex gap-4">
              <SectionMenu course={course} />
              {!isPurchased ? (
                <Button
                  onClick={handleEnrollment}
                  disabled={isLoading}
                  className="outline-none bg-slate-800 p-4 rounded-md text-white"
                >
                  {isLoading ? (
                    <>
                      Enrolling.. <Spinner />
                    </>
                  ) : (
                    "Enroll Course"
                  )}
                </Button>
              ) : (
                <ProgressButton
                  courseId={course.id}
                  sectionId={section.id}
                  isCompleted={!!progress?.isCompleted}
                />
              )}
            </div>
          </div>

          <ReadText value={section.description || ""} />

          <MotionDiv
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, damping: 10, stiffness: 100, type: "spring" }}
          >
            <h2 className="text-xl font-bold mb-5">Resources</h2>
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={resource.fileUrl}
                target="_blank"
                className="flex items-center py-5 my-4 bg-[#9aabbda1] rounded-lg text-sm font-medium p-3"
              >
                <File className="h-4 w-4 mr-4" />
                {resource.name}
              </Link>
            ))}
          </MotionDiv>

          {runConfetti && (
            <Confetti width={width} height={height} numberOfPieces={100} />
          )}
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </Suspense>
  );
};

export default SectionsDetails;
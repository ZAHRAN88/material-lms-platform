"use client";

import {
  Course,
  MuxData,
  Progress as PrismaProgress,
  Purchase,
  Resource,
  Section,
} from "@prisma/client";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { File, Lock, BookOpen, Clock, Award, ChevronRight, PlayCircle, Medal } from "lucide-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { MotionDiv, MotionH1 } from "../MotionDiv";
import Confetti from "confetti-react";
import useWindowSize from "react-use/lib/useWindowSize";
import { Button } from "../ui/button";
import { Suspense } from "react";
import ReadText from "../custom/ReadText";
import { useAuth } from "@/lib/AuthContext";
import { enrollCourse } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Image from "next/image";

const LoadingSkeleton = () => (
  <div className="px-6 py-4 flex flex-col gap-5 animate-pulse">
    <div className="h-40 bg-gray-100 rounded-xl mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-20 w-1/4 bg-gray-100 rounded-lg"></div>
          <div className="h-20 w-3/4 bg-gray-100 rounded-lg"></div>
        </div>
      ))}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: "locked" | "free" | "enrolled" }) => {
  const styles = {
    locked: "bg-red-100 text-red-800 border-red-200",
    free: "bg-green-100 text-green-800 border-green-200",
    enrolled: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const labels = {
    locked: "Locked",
    free: "Free",
    enrolled: "Enrolled",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <Link href={resource.fileUrl} target="_blank">
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4">
        {
          resource.name.includes("Video")?<>
          <PlayCircle/>
          </>: resource.name.includes("Hagag")? <>
          <><Medal color="#ffe042" /></>
          </>:<>

          { resource.fileUrl.includes("drive")?<>
          
          <Image
          src={"/drive.png"}
          alt="drive icon"
          width={40}
          height={40}
          />

          </>:

            <File/>
            }
          </>
        }
        <div>
          <CardTitle className="text-lg">{resource.name}</CardTitle>
          <CardDescription>
            {  "Additional resource"}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  </Link>
);

const CourseProgress = ({ progress }: { progress: number }) => (
  <div className="w-full space-y-2">
    <div className="flex justify-between text-sm text-gray-600">
      <span>Course Progress</span>
      <span>{progress}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
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
  progress: PrismaProgress | null;
  path: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const [optimisticEnrollment, setOptimisticEnrollment] = useState(false);
  const { width, height } = useWindowSize();
  const router = useRouter();
  const { user } = useAuth();

  const isPurchased = optimisticEnrollment || purchase?.customerId === user?.id;
  const isLocked = !purchase && !section.isFree;

  const handleEnrollment = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to enroll in a course");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    setOptimisticEnrollment(true);

    try {
      const formData = new FormData();
      formData.append('courseId', course.id);

      const result = await enrollCourse(formData);
      if (result.success) {
        toast.success(result.message || 'Successfully enrolled in the course!');
        setRunConfetti(true);
        router.refresh();
        setTimeout(() => setRunConfetti(false), 3000);
      } else {
        setOptimisticEnrollment(false);
        toast.error(result.error || "Failed to enroll in the course");
      }
    } catch (error) {
      setOptimisticEnrollment(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#020817] dark:text-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={
                      isPurchased ? "enrolled" : section.isFree ? "free" : "locked"
                    }
                  />
                  <span className="text-sm text-gray-500">
                    Section {section.position+1} of {course.sections.length}
                  </span>
                </div>
                <h1 className="text-3xl font-bold ">
                  {section.title}
                </h1>
              </div>

              <div className="flex gap-3">
                <SectionMenu course={course} />
                {!isPurchased ? (
                  <Button
                    onClick={handleEnrollment}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
                             transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        <span>Enrolling...</span>
                      </div>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>Enroll Now</span>
                      </>
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

            {/* Course Progress */}
         
          </MotionDiv>

          {/* Description Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Section Notes
              </CardTitle>
            </CardHeader>
            <CardContent className={`${!section.description?"text-center text-gray-400 text-xl font-bold ":""}`}>
              <ReadText value={section.description || "No Notes For this Section"} />
            </CardContent>
          </Card>

          {/* Resources Section */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold  mb-4">
              Section Resources
            </h2>
            
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertTitle>No resources available</AlertTitle>
                <AlertDescription>
                  This section does not have any resources yet. Check back later!
                </AlertDescription>
              </Alert>
            )}
          </MotionDiv>

          {runConfetti && (
            <Confetti
              width={width}
              height={height}
              numberOfPieces={200}
              recycle={false}
              colors={['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']}
            />
          )}
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </Suspense>
  );
};

export default SectionsDetails;
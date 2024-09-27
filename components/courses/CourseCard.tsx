import { getCourseDetails } from "@/app/actions";
import { Course } from "@prisma/client";
import { Gem, UsersRound, Clock, User as UserIcon, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MotionDiv } from "../MotionDiv";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTimeAgo } from "@/lib/utils";
import CourseSkeleton from "./CourseSkeleton";

const CourseCard = async ({ course }: { course: Course }) => {
  const courseDetails = await getCourseDetails(course.id);

  if (!courseDetails) {
    return <CourseSkeleton />; 
  }

  const { instructor, membersCount, sectionsCount, level, category } = courseDetails;

  return (
    <Link href={`/courses/${course.id}/overview`} prefetch>
      <MotionDiv>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 w-96 h-96">
          <CardHeader className="p-0">
            <div className="relative">
              <Image
                src={course.imageUrl || "/image_placeholder.webp"}
                alt={course.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover"
                priority={true}
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {course.subCategoryId === "0fd2caa0-ccf4-4aa3-8f80-62f927e176c4" ? "Basmaga" : "Programming"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h2>
            {instructor && (
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span>{instructor.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Book className="w-4 h-4" />
                <span>{sectionsCount} {sectionsCount === 1 ? "Week" : "Weeks"}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersRound className="w-4 h-4" />
                <span>{membersCount}</span>
              </div>
              {level && (
                <Link href={`/categories/${category?.id}`}>
                  <Badge variant="outline" className="text-xs hover:bg-gray-200">
                    Level {level.name}
                  </Badge>
                </Link>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            {course.price && course.price > 0 ? (
              <span className="text-lg font-bold text-primary">${course.price}</span>
            ) : (
              <></>
            )}
            <div className="text-sm text-muted-foreground">
              {course.updatedAt && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{getTimeAgo(new Date(course.updatedAt))}</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </MotionDiv>
    </Link>
  );
};

export default CourseCard;

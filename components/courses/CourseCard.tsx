import React from 'react';
import { getCourseDetails } from "@/app/actions";
import { Course } from "@prisma/client";
import { Book, Clock, GraduationCap, Star, User as UserIcon, Users } from "lucide-react";
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
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300  h-[400px] group">
          <CardHeader className="p-0">
            <div className="relative">
              <Image
                src={course.imageUrl || "/image_placeholder.webp"}
                alt={course.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {course.subCategoryId === "0fd2caa0-ccf4-4aa3-8f80-62f927e176c4" ? "Basmaga" : 
                 course.subCategoryId === "39349519-412c-48f0-8f65-ff35c755a05c" ? "Out Source" : "Programming"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h2>
            {instructor && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span>{instructor.name}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Book className="w-4 h-4" />
                <span>{sectionsCount} {sectionsCount === 1 ? "Week" : "Weeks"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{membersCount} students</span>
              </div>
              {level && (
                <div className="flex items-center gap-1">
                  Level
                  <span>{level.name}</span>
                </div>
              )}
              {/* {averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              )} */}
            </div>
            {category && (
              <Link href={`/categories/${category.id}`}>
                <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                  {category.name}
                </Badge>
              </Link>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
          
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

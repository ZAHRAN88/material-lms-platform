import { db } from "@/lib/db";
import { getUserById } from "@/lib/auth";
import { Course } from "@prisma/client";
import { Gem, UsersRound, Clock, User, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MotionDiv } from "../MotionDiv";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CourseCard = async ({ course }: { course: Course }) => {
  const instructor = await getUserById(course.instructorId);
  const membersCount = await db.purchase.count({ where: { courseId: course.id } });
  const sectionsCount = await db.section.count({ where: { courseId: course.id } });
  const level = course.levelId ? await db.level.findUnique({ where: { id: course.levelId } }) : null;
  const category = course.categoryId ? await db.category.findUnique({ where: { id: course.categoryId } }) : null;
  return (
    <Link href={`/courses/${course.id}/overview`}>
      <MotionDiv>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-0">
            <div className="relative">
              <Image
                src={course.imageUrl || "/image_placeholder.webp"}
                alt={course.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {course.subCategoryId === "0fd2caa0-ccf4-4aa3-8f80-62f927e176c4" ? "Basmaga" : "Programming"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h2>
            {instructor && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{instructor.name}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                 {/* replace with book icon */}
                 <Book className="w-4 h-4" />
                <span>{sectionsCount} {sectionsCount === 1 ? "Week" : "Weeks"}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersRound className="w-4 h-4" />
                <span>{membersCount}</span>
              </div>
              {level && (
                <Link href={`/categories/${category?.id}`}>
                <Badge variant="outline" className="text-xs hover:bg-gray-200 ">
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
            
          </CardFooter>
        </Card>
      </MotionDiv>
    </Link>
  );
};

export default CourseCard;

import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/courses/Columns";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { getUserFromToken } from "@/app/actions";
const CoursesList = async () => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const specificUserId = 'user_2jwilhi4UHfVpPyD2U2wvNx5rmr'; 

  let courses;
  if (user.id === specificUserId) {
    courses = await db.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    courses = await db.course.findMany({
      where: {
        instructorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return <DataTable columns={columns} data={courses} />;
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, index) => (
      <CourseSkeleton key={index} />
    ))}
  </div>
);

const CoursesPage = async () => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-5">
        <Suspense fallback={<LoadingSkeleton />}>
          <CoursesList />
        </Suspense>
      </div>
    </div>
  );
};

export default CoursesPage;
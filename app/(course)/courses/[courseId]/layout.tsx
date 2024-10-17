import { getUserFromToken } from "@/app/actions";
import ScrollRange from "@/components/ScrollRange";
import CourseSideBar from "@/components/layout/CourseSideBar";
import Topbar from "@/components/layout/Topbar";
import { Admins } from "@/lib/actions";
import { db } from "@/lib/db";


import { redirect } from "next/navigation";

const CourseDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const admins = await Admins();
  const isAdmin = user?.role === "ADMIN";


  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar isAdmin={isAdmin} />
      <ScrollRange />
      <div className="flex-1 flex">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
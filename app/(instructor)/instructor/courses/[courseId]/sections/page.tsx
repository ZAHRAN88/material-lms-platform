import { redirect } from "next/navigation";

import CreateSectionForm from "@/components/sections/CreateSectionForm";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/app/actions";
const CourseCurriculumPage = async ({ params }: { params: { courseId: string }}) => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const specificUserId = 'user_2jwilhi4UHfVpPyD2U2wvNx5rmr';

  let course;
  if (user.id === specificUserId) {
    course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        sections: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  } else {
    course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: user.id,
      },
      include: {
        sections: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  if (!course) {
    return redirect("/instructor/courses");
  }

  return (
    <CreateSectionForm course={course} />
  );
}

export default CourseCurriculumPage;
import { db } from "@/lib/db";
import { getUserFromToken } from "@/app/actions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await getUserFromToken();
    const { courseId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: user.id },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, instructorId: user.id },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse, { status: 200 });
  } catch (err) {
    console.log("[courseId_unpublish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
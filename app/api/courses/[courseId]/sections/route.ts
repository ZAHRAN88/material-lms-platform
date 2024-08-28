import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/app/actions";
export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, instructorId: user.id },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const lastSection = await db.section.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 0;

    const { title } = await req.json();

    const newSection = await db.section.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(newSection, { status: 200 });
  } catch (err) {
    console.log("[sections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

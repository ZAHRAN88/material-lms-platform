import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/app/actions";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string; resourceId: string } }
) => {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId, resourceId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section Not Found", { status: 404 });
    }

    // Ensure the resource exists before trying to delete it
    const resource = await db.resource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (!resource) {
      return new NextResponse("Resource Not Found", { status: 404 });
    }

    await db.resource.delete({
      where: {
        id: resourceId,
      },
    });
    
    return NextResponse.json("Resource deleted", { status: 200 });
  } catch (err) {
    console.log("[resourceId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

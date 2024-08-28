import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/app/actions";
export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    const unpublishedSection = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedSectionsInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
          instructorId: user.id,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedSection, { status: 200 });
  } catch (err) {
    console.log("[sectionId_unpublish_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
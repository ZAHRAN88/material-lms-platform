import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/app/actions";
export const PUT = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: user.id,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (let item of list) {
      await db.section.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse("Reorder sections successfully", { status: 200 });
  } catch (err) {
    console.log("[reorder_PUT]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

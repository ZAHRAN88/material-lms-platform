import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Mux from "@mux/mux-node";
import { getUserFromToken } from "@/app/actions";
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const values = await req.json();

    const course = await db.course.update({
      where: { id: courseId },
      data: {
        ...values,
        updatedAt: new Date(), 
      },
    });

    return NextResponse.json(course);
  } catch (error: unknown) { // Specify the type of error
    console.error("[COURSE_ID_PATCH]", (error as Error).message); // Cast to Error
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getUserFromToken();
    const { courseId } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: user.id },
      include: {
        sections: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (const section of course.sections) {
      if (section.muxData?.assetId) {
        await video.assets.delete(section.muxData.assetId);
      }
    }

    await db.course.delete({
      where: { id: courseId, instructorId: user.id },
    });

    return new NextResponse("Course Deleted", { status: 200 });
  } catch (err: unknown) { // Specify the type of error
    console.error("[courseId_DELETE]", (err as Error).message); // Cast to Error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    console.log('API - Course ID:', course.id);
    console.log('API - Updated At:', course.updatedAt);

    return NextResponse.json(course);
  } catch (error: unknown) { // Specify the type of error
    console.error("[COURSE_GET]", (error as Error).message); // Cast to Error
    return new NextResponse("Internal Error", { status: 500 });
  }
}

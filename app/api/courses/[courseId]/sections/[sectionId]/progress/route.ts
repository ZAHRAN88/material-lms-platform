import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/app/actions";
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isCompleted } = await req.json();

    const userProgress = await db.progress.upsert({
      where: {
        studentId_sectionId: {
          studentId: user.id,
          sectionId: params.sectionId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        studentId: user.id,
        sectionId: params.sectionId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("[SECTION_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
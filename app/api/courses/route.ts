import { getUserFromToken } from "@/app/actions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, categoryId, subCategoryId } = await req.json();

    const newCourse = await db.course.create({
      data: {
        title,
        categoryId,
        subCategoryId,
        instructorId: user.id
      }
    });

    return NextResponse.json(newCourse, { status: 200 });
  } catch (err) {
    console.log("[courses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
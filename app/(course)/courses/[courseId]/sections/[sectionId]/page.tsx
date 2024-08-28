import { getUserFromToken } from "@/app/actions";
import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/lib/db";
import { Resource } from "@prisma/client";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { courseId, sectionId } = params;
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: user.id,
        courseId,
      },
    },
  });

  let muxData = null;
  let resources: Resource[] = [];

  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });
  }

  if (section.isFree) {
    resources = await db.resource.findMany({
      where: {
        sectionId,
      },
    });
  }

  const progress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: user.id,
        sectionId,
      },
    },
  });

  return (
    <SectionsDetails
      path=""
      course={course}
      section={section}
      purchase={purchase}
      muxData={muxData}
      resources={resources}
      progress={progress}
    />
  );
};

export default SectionDetailsPage;
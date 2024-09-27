import { getUserFromToken } from "@/app/actions";
import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/lib/db";
import { Resource } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from 'react'

export const revalidate = 3600; // Revalidate every hour

const getCachedCourse = cache(async (courseId: string) => {
  return await db.course.findUnique({
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
});

const getCachedSection = cache(async (sectionId: string, courseId: string) => {
  return await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });
});

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

  const coursePromise = getCachedCourse(courseId);
  const sectionPromise = getCachedSection(sectionId, courseId);

  const [course, section] = await Promise.all([coursePromise, sectionPromise]);

  if (!course) {
    return redirect("/");
  }

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }

  const purchasePromise = db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: user.id,
        courseId,
      },
    },
  });

  const progressPromise = db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: user.id,
        sectionId,
      },
    },
  });

  const [purchase, progress] = await Promise.all([purchasePromise, progressPromise]);

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
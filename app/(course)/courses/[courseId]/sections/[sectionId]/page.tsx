import { getUserFromToken } from "@/app/actions";
import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/lib/db";
import { Resource, Course, Section, Purchase, Progress, MuxData } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from 'react'

// Cache the course fetching
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

// Cache the section fetching
const getCachedSection = cache(async (sectionId: string, courseId: string) => {
  return await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });
});

// Cache the resources fetching
const getCachedResources = cache(async (sectionId: string) => {
  return await db.resource.findMany({
    where: { sectionId },
  });
});

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function SectionDetailsPage({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) {
  const { courseId, sectionId } = params;
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const coursePromise = getCachedCourse(courseId);
  const sectionPromise = getCachedSection(sectionId, courseId);
  const resourcesPromise = getCachedResources(sectionId);

  const [course, section, resources] = await Promise.all([
    coursePromise,
    sectionPromise,
    resourcesPromise,
  ]);

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

  const purchase = await purchasePromise;

  let muxData: MuxData | null = null;
  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });
  }

  const progress = await progressPromise;

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
}

export default SectionDetailsPage;
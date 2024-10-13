import React, { Suspense } from 'react';
import { getUserFromToken } from "@/app/actions";
import SectionsDetails from "@/components/sections/SectionsDetails";
import DotsLoader from "@/components/ui/dotsLoader"
import { db } from "@/lib/db";
import { Resource, Course, Section, Purchase, Progress, MuxData, Question } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from 'react'

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

const getCachedResources = cache(async (sectionId: string) => {
  return await db.resource.findMany({
    where: { sectionId },
  });
});

const getCachedQuestions = cache(async (sectionId: string) => {
  return await db.question.findMany({
    where: { sectionId },
  });
});

export const dynamic = 'force-dynamic';
export const revalidate = 3600;



async function SectionContent({ courseId, sectionId, user }: { courseId: string, sectionId: string, user: any }) {
  const coursePromise = getCachedCourse(courseId);
  const sectionPromise = getCachedSection(sectionId, courseId);
  const resourcesPromise = getCachedResources(sectionId);
  const questionsPromise = getCachedQuestions(sectionId);

  const [course, section, resources, questions] = await Promise.all([
    coursePromise,
    sectionPromise,
    resourcesPromise,
    questionsPromise,
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

  const [purchase, progress] = await Promise.all([purchasePromise, progressPromise]);

  let muxData: MuxData | null = null;
  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
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
}

async function SectionContentWrapper({ courseId, sectionId }: { courseId: string, sectionId: string }) {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  return <SectionContent courseId={courseId} sectionId={sectionId} user={user} />;
}

function SectionDetailsPage({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) {
  const { courseId, sectionId } = params;
  
  return (
    <Suspense fallback={<DotsLoader />}>
      <SectionContentWrapper courseId={courseId} sectionId={sectionId} />
    </Suspense>
  );
}

export default SectionDetailsPage;
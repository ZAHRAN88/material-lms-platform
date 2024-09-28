import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getUserFromToken } from "@/app/actions";
import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/lib/db";
import { Resource, Course, Section, Purchase, Progress, MuxData } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from 'react'

// Extend the Params interface to include both courseId and sectionId
interface Params extends ParsedUrlQuery {
  courseId: string;
  sectionId: string;
}

// Define the props interface for the page component
interface PageProps {
  course: Course & { sections: Section[] };
  section: Section;
  resources: Resource[];
}

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

export const getStaticPaths: GetStaticPaths = async () => {
  const sections = await db.section.findMany({
    where: { isPublished: true },
    select: { id: true, courseId: true }
  });

  const paths = sections.map((section) => ({
    params: { courseId: section.courseId, sectionId: section.id },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({ params }) => {
  const { courseId, sectionId } = params!;

  const coursePromise = getCachedCourse(courseId);
  const sectionPromise = getCachedSection(sectionId, courseId);
  const resourcesPromise = db.resource.findMany({
    where: { sectionId },
  });

  const [course, section, resources] = await Promise.all([
    coursePromise,
    sectionPromise,
    resourcesPromise,
  ]);

  if (!course || !section) {
    return { notFound: true };
  }

  return {
    props: {
      course,
      section,
      resources,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

const SectionDetailsPage = async ({
  course,
  section,
  resources,
}: PageProps) => {
  const user = await getUserFromToken();

  if (!user) {
    return redirect("/sign-in");
  }

  const purchasePromise = db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: user.id,
        courseId: course.id,
      },
    },
  });

  const progressPromise = db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: user.id,
        sectionId: section.id,
      },
    },
  });

  const muxDataPromise = db.muxData.findUnique({
    where: {
      sectionId: section.id,
    },
  });

  const [purchase, progress, muxData] = await Promise.all([
    purchasePromise,
    progressPromise,
    muxDataPromise,
  ]);

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
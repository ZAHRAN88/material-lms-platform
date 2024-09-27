import { db } from "@/lib/db";

export const fetchEngineers = async () => {
  const engineers = await db.engineer.findMany({
    select: {
      id: true,
      name: true,
      times: {
        select: {
          id: true,
          day: true,
          time: true,
          place: true,
          engineerId: true,
        },
      },
    },
  });
  return engineers;
};

// Fetch data at build time
export async function getStaticProps() {
  const engineers = await fetchEngineers(); // Use the fetcher

  return {
    props: {
      engineers,
    },
    revalidate: 60, 
  };
}


import { Suspense } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TextEffect } from "@/components/TextEffect";
import { revalidatePath } from "next/cache";

type TimeSlot = {
  id: string;
  day: string;
  time: string;
  place: string;
  engineerId: string;
};

type Engineer = {
  id: string;
  name: string;
  times: TimeSlot[];
};

const EngineerTimesClient = dynamic(() => import("./EngineerTimesClient"), {
  loading: () => <LoadingSkeleton />,
});
async function deleteTimeSlot(timeSlotId: string) {
  'use server';
  await db.timeSlot.delete({ where: { id: timeSlotId } });
  revalidatePath('/mwaead');
}

const LoadingSkeleton = () => (
  <Card className="w-full max-w-2xl mx-auto">
    <CardContent className="p-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      {[...Array(5)].map((_, index) => (
        <div key={index} className="space-y-2 mb-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const EngineerTimesServer = async () => {
  const engineers: Engineer[] = await db.engineer.findMany({
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

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <div className="text-xl font-bold">
      <TextEffect per="char" preset="fade">
        {`Check your schedule here`}
      </TextEffect>
      

      </div>
      <div dir="rtl" className="text-sm font-bold text-red-500">
      <TextEffect per='word' as='p' preset='blur'>
      {`المواعيد  لسنة  تالتة  بس`}
    </TextEffect>
      

      </div>

      <Card className="w-full max-w-2xl mx-auto mt-10 ">
        <CardContent className="p-6">
          <EngineerTimesClient engineers={engineers}  />
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineerTimesServer;

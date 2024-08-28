import { Skeleton } from "@/components/ui/skeleton";

const CourseSkeleton = () => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;

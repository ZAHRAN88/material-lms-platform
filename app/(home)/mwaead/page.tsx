// components/EngineerTimesServer.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/lib/db';
import { Box } from '@mui/material';

const EngineerTimesClient = dynamic(() => import('./EngineerTimesClient'), {
  loading: () => <LoadingSkeleton />,
});

const LoadingSkeleton = () => (
  <Box className="p-4 max-w-md mx-auto animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    {[...Array(5)].map((_, index) => (
      <div key={index} className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </Box>
);

const EngineerTimesServer = async () => {
  const engineers = await db.engineer.findMany({
    select: {
      id: true,
      name: true,
      times: {
        select: {
          id: true,
          day: true,
          
        },
      },
    },
    
  });

  return (
    <Box className="p-4 max-w-md mx-auto">
      <EngineerTimesClient engineers={engineers.map(engineer => ({
        ...engineer,
        times: engineer.times.map(time => ({
          ...time,
          time: '', 
          place: '' 
        }))
      }))} />
    </Box>
  );
};

export default EngineerTimesServer;
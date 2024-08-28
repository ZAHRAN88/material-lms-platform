// components/EngineerTimesClient.tsx
'use client';

import { useState } from 'react';
import { Box,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { MotionDiv } from '@/components/MotionDiv';
import { Button } from '@/components/ui/button';

interface Engineer {
  id: string;
  name: string;
  times: TimeSlot[];
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  place: string;
}

interface EngineerTimesClientProps {
  engineers: Engineer[];
}

const EngineerTimesClient: React.FC<EngineerTimesClientProps> = ({ engineers }) => {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);

  const handleClick = (engineer: Engineer) => {
    // Set the selected engineer
    setSelectedEngineer(engineer);
  };

  return (
    <Box className="p-4 max-w-md mx-auto">
      <Box className="flex flex-wrap gap-4 items-center justify-center mb-4">
        {engineers.map((engineer) => (
          <MotionDiv
            key={engineer.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              
              onClick={() => handleClick(engineer)}
              className="flex-1 sm:flex-none dark:bg-white dark:text-[#002E7A] font-bold"
            >
              {`Eng:${engineer.name}`}
            </Button>
          </MotionDiv>
        ))}
      </Box>

      <Box className="flex w-full flex-wrap gap-3">
        {selectedEngineer ? (
          <>
            
            {selectedEngineer.times.length > 0 ? (
              <MotionDiv
                key="times-table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              > 
                <TableContainer component={Paper} className="mt-2 flex flex-1 dark:bg-[#020817] dark:text-white">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className='dark:text-white dark:border-white'  >Day</TableCell>
                        <TableCell className='dark:text-white dark:border-white'>Time Slot</TableCell>
                        <TableCell className='dark:text-white dark:border-white'>Place</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className=' '>
                      {selectedEngineer.times.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell className='dark:text-white dark:border-white'>{slot.day}</TableCell>
                          <TableCell className='dark:text-white dark:border-white'>{slot.time}</TableCell>
                          <TableCell className='dark:text-white dark:border-white'>{slot.place}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MotionDiv>
            ) : (
              <Typography className="mt-2 text-center w-full">
                No times available for this engineer.
              </Typography>
            )}
          </>
        ) : (
          <Typography className="mt-2 text-center w-full">
            Please select an engineer to see the times.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EngineerTimesClient;

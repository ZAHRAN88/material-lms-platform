'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import DaySchedule from './DaySchedule';

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
  engineerId: string; // Add this line
}

interface EngineerTimesClientProps {
  engineers: Engineer[];
}

const EngineerTimesClient: React.FC<EngineerTimesClientProps> = ({ engineers }) => {
  const [selectedEngineerId, setSelectedEngineerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'engineer' | 'day'>('engineer');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const selectedEngineer = engineers.find(e => e.id === selectedEngineerId) || null;

  const days = ['Sunday'||'sunday', 'Monday'||'monday', 'Tuesday'||'tuesday', 'Wednesday'||'wednesday', 'Thursday'||'thursday', 'Friday'||'friday', 'Saturday'||'saturday'];

  const allTimes = engineers.flatMap(engineer => engineer.times);

  const buttonVariants = {
    active: { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
    inactive: { scale: 1 }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.div
          variants={buttonVariants}
          animate={viewMode === 'engineer' ? 'active' : 'inactive'}
        >
          <Button onClick={() => setViewMode('engineer')} variant={viewMode === 'engineer' ? "default" : "outline"}>
            View by Engineer
          </Button>
        </motion.div>
        <motion.div
          variants={buttonVariants}
          animate={viewMode === 'day' ? 'active' : 'inactive'}
        >
          <Button onClick={() => setViewMode('day')} variant={viewMode === 'day' ? "default" : "outline"}>
            View by Day
          </Button>
        </motion.div>
      </div>

      {viewMode === 'engineer' ? (
        <>
          <Select onValueChange={(value) => setSelectedEngineerId(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an engineer" />
            </SelectTrigger>
            <SelectContent>
              {engineers.map((engineer) => (
                <SelectItem key={engineer.id} value={engineer.id}>
                  {engineer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AnimatePresence mode="wait">
            {selectedEngineer && (
              <motion.div
                key={selectedEngineer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ScrollArea className="h-[300px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time Slot</TableHead>
                        <TableHead>Place</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {selectedEngineer.times.map((slot, index) => (
                          <motion.tr
                            key={slot.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={tableRowVariants}
                          >
                            <TableCell>{slot.day}</TableCell>
                            <TableCell>{slot.time}</TableCell>
                            <TableCell>{slot.place}</TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedEngineer && (
            <p className="text-center text-muted-foreground">
              Please select an engineer to see their times.
            </p>
          )}
        </>
      ) : (
        <DaySchedule days={days} allTimes={allTimes} engineers={engineers} />
      )}
    </div>
  );
};

export default EngineerTimesClient;

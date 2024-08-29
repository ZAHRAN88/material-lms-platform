'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => setViewMode('engineer')} variant={viewMode === 'engineer' ? "default" : "outline"}>
          View by Engineer
        </Button>
        <Button onClick={() => setViewMode('day')} variant={viewMode === 'day' ? "default" : "outline"}>
          View by Day
        </Button>
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

          {selectedEngineer && (
            <motion.div
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
                    {selectedEngineer.times.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{slot.day}</TableCell>
                        <TableCell>{slot.time}</TableCell>
                        <TableCell>{slot.place}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </motion.div>
          )}

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

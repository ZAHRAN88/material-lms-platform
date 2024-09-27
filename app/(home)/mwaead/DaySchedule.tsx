'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { format } from 'date-fns'; 

interface TimeSlot {
  id: string;
  day: string;
  time: string; 
  place: string;
  engineerId: string;
}

interface Engineer {
  id: string;
  name: string;
}

interface DayScheduleProps {
  days: string[];
  allTimes: TimeSlot[];
  engineers: Engineer[];
  customSchedule: TimeSlot[]; // Add customSchedule prop
}

const DaySchedule: React.FC<DayScheduleProps> = ({ days, allTimes, engineers, customSchedule }) => { // Update props
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const timesForSelectedDay = selectedDay
    ? allTimes
        .filter(slot => slot.day === selectedDay)
        .sort((a, b) => new Date(`1970-01-01T${a.time}`) > new Date(`1970-01-01T${b.time}`) ? 1 : -1) 
    : [];

  return (
    <div className="space-y-6">
      <Select onValueChange={(value) => setSelectedDay(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDay && timesForSelectedDay.length > 0 && (
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
                  <TableHead>Engineer</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Place</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesForSelectedDay.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{engineers.find(e => e.id === slot.engineerId)?.name}</TableCell>
                    <TableCell>{format(new Date(`1970-01-01T${slot.time}`), 'h:mm a')}</TableCell> {/* Updated time format */}
                    <TableCell>{slot.place}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </motion.div>
      )}

      {selectedDay && timesForSelectedDay.length === 0 && (
        <p className="text-center text-muted-foreground">
          No schedules available for {selectedDay}, {selectedDay} is a day off.
        </p>
      )}

      {!selectedDay && (
        <p className="text-center text-muted-foreground">
          Please select a day to see the schedules.
        </p>
      )}

      {/* Display custom schedule */}
      {customSchedule.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Your Custom Schedule for {selectedDay}:</h3>
          <ul>
            {customSchedule
              .filter(slot => slot.day === selectedDay) // Filter custom schedule by selected day
              .map((slot) => (
                <li key={slot.id}>
                  {slot.day} at {format(new Date(`1970-01-01T${slot.time}`), 'h:mm a')} - {slot.place}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DaySchedule;

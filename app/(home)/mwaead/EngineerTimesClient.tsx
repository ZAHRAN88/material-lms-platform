"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ar } from "date-fns/locale";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DaySchedule from "./DaySchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  times: TimeSlot[];
}

interface ScheduleItem extends TimeSlot {
  engineerName: string;
}

interface EngineerTimesClientProps {
  engineers: Engineer[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LOCAL_STORAGE_KEY = "customSchedule";

const EngineerTimesClient: React.FC<EngineerTimesClientProps> = ({ engineers }) => {
  const [selectedEngineerId, setSelectedEngineerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"engineer" | "day">("engineer");
  const [customSchedule, setCustomSchedule] = useState<ScheduleItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Error parsing saved schedule:", error);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (customSchedule.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customSchedule));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [customSchedule]);

  const selectedEngineer = useMemo(() => 
    engineers.find((e) => e.id === selectedEngineerId) || null, 
    [engineers, selectedEngineerId]
  );

  const allTimes = useMemo(() => engineers.flatMap((engineer) => engineer.times), [engineers]);

  const sortedTimes = useMemo(() => 
    selectedEngineer?.times.sort((a, b) => {
      const dayOrder = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return new Date(`1970-01-01T${a.time}`) > new Date(`1970-01-01T${b.time}`) ? 1 : -1;
    }) || [],
    [selectedEngineer]
  );

  const handleTimeSelect = useCallback((timeSlot: TimeSlot) => {
    if (!selectedEngineer) return;

    setCustomSchedule(prev => {
      const existingIndex = prev.findIndex(item => item.id === timeSlot.id);
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        const hasOverlap = prev.some(item => 
          item.day === timeSlot.day && item.time === timeSlot.time ||item.engineerId===timeSlot.engineerId
        );

        if (hasOverlap) {
          toast.error("This time slot overlaps with an existing selection. Please choose a different time.");
          return prev;
        }

        const newItem: ScheduleItem = {
          ...timeSlot,
          engineerName: selectedEngineer.name
        };
        return [...prev, newItem].sort((a, b) => {
          const dayOrder = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
          if (dayOrder !== 0) return dayOrder;
          return new Date(`1970-01-01T${a.time}`) > new Date(`1970-01-01T${b.time}`) ? 1 : -1;
        });
      }
    });
  }, [selectedEngineer]);

  const saveCustomSchedule = useCallback(() => {
    const doc = new jsPDF();
    
    doc.setFont("Arial Unicode MS");

    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("My Custom Table", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    

    const tableData = customSchedule.map(slot => [
      format(new Date(`1970-01-01T${slot.time}`), "h:mm a"),
      slot.place,
      slot.engineerName,
      slot.day,
    ]);

    (doc as any).autoTable({
      head: [['Time', 'Place', 'Engineer', 'Day']],
      body: tableData,
      startY: 50,
      styles: { font: "Arial Unicode MS", fontSize: 10 },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { halign: 'center' },
      alternateRowStyles: { fillColor: [235, 245, 251] },
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 30 }
      }
    });

    doc.save("custom_schedule.pdf");
    toast.success("Your Custom Table is downloaded✔️✔️");
  }, [customSchedule]);

  const clearCustomSchedule = useCallback(() => {
    setCustomSchedule([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Custom schedule cleared successfully!");
  }, []);

  const renderEngineerView = () => (
    <>
      <Select onValueChange={setSelectedEngineerId}>
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
                    <TableHead>Select</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Place</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTimes.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={customSchedule.some(item => item.id === slot.id)}
                          onChange={() => handleTimeSelect(slot)}
                        />
                      </TableCell>
                      <TableCell>{slot.day}</TableCell>
                      <TableCell>
                        {format(new Date(`1970-01-01T${slot.time}`), "h:mm a")}
                      </TableCell>
                      <TableCell>{slot.place}</TableCell>
                    </TableRow>
                  ))}
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
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.div
          variants={{
            active: { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
            inactive: { scale: 1 }
          }}
          animate={viewMode === "engineer" ? "active" : "inactive"}
        >
          <Button
            onClick={() => setViewMode("engineer")}
            variant={viewMode === "engineer" ? "default" : "outline"}
          >
            View by Engineer
          </Button>
        </motion.div>
        <motion.div
          variants={{
            active: { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
            inactive: { scale: 1 }
          }}
          animate={viewMode === "day" ? "active" : "inactive"}
        >
          <Button
            onClick={() => setViewMode("day")}
            variant={viewMode === "day" ? "default" : "outline"}
          >
            View by Day
          </Button>
        </motion.div>
      </div>

      {viewMode === "engineer" ? renderEngineerView() : (
        <DaySchedule 
          days={DAYS} 
          allTimes={allTimes} 
          engineers={engineers} 
          customSchedule={customSchedule}
        />
      )}

      {customSchedule.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Custom Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {customSchedule.map((slot) => (
                <li key={slot.id} className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-primary">
                        {slot.day}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(`1970-01-01T${slot.time}`), "h:mm a")}
                      </span>
                    </div>
                    <Badge>{slot.engineerName}</Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(`1970-01-01T${slot.time}`), "h:mm a")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{slot.place}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{slot.engineerName}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={saveCustomSchedule} className="w-full sm:w-auto">
                Save Custom Schedule as PDF
              </Button>
              <Button onClick={clearCustomSchedule} variant="destructive" className="w-full sm:w-auto">
                Clear Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EngineerTimesClient;
